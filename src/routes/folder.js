const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs-extra");

router.post("/dashboard", async (req, res) => {
  const { parentPath, folderName, userId } = req.body;

  if (!folderName || !userId) {
    return res.status(400).send("Folder name and user ID are required");
  }

  try {
    let folderPath = folderName; // Default to folder name

    if (parentPath && parentPath !== "dashboard") {
      folderPath = `${parentPath}/${folderName}`; // Append to parent path correctly
    } else {
      folderPath = `dashboard/${folderName}`; // Default to dashboard folder
    }

    // Check if the folder already exists
    const existingFolder = await prisma.folder.findUnique({
      where: { path: folderPath },
    });

    if (existingFolder) {
      return res.status(400).send("Folder already exists");
    }

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
        parentId: parentFolder ? parentFolder.id : null, // Assign parentId correctly
      },
    });

    // Create the actual folder in the filesystem
    const physicalFolderPath = path.join(__dirname, "../uploads", folderPath);
    await fs.ensureDir(physicalFolderPath);

    // Redirect to the newly created folder
    res.redirect(`/${folderPath}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating folder");
  }
});

module.exports = router;
