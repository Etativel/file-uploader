const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs-extra");

router.post("/dashboard/create", async (req, res) => {
  const { parentPath, folderName, userId } = req.body;

  if (!folderName || !userId) {
    return res.status(400).send("Folder name and user ID are required");
  }

  try {
    let folderPath = folderName;
    if (parentPath && parentPath !== "dashboard") {
      folderPath = `${parentPath}/${folderName}`;
    } else {
      folderPath = `dashboard-${req.user.id}/${folderName}`;
    }

    // Check if the folder already exists
    const existingFolder = await prisma.folder.findUnique({
      where: { path: folderPath },
    });

    if (existingFolder) {
      return res.status(400).send("Folder already exists");
    }

    // let finalFolderPath = folderPath;
    // let counter = 1;
    // while (
    //   await prisma.folder.findUnique({ where: { path: finalFolderPath } })
    // ) {
    //   finalFolderPath = `${folderPath} (${counter})`;
    //   counter++;
    // }

    // Find the parent folder
    let parentFolder = await prisma.folder.findUnique({
      where: { path: parentPath },
    });

    // Create the folder in the database
    const newFolder = await prisma.folder.create({
      data: {
        name: folderName,
        path: folderPath,
        userId: parseInt(userId),
        parentId: parentFolder ? parentFolder.id : null,
      },
    });

    let redirectPath = folderPath.replace("uploads", "");
    redirectPath = redirectPath.substring(0, redirectPath.lastIndexOf("/"));

    let updatedUrl = redirectPath.replace(/(dashboard)-\d+/, "$1");

    res.redirect(`${updatedUrl}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating folder");
  }
});

module.exports = router;
