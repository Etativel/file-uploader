const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const upload = require("../middlewares/upload");
const fs = require("fs-extra");

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/:folderPath?",
  async (req, res, next) => {
    const folderPath = req.params.folderPath
      ? `${req.params.folderPath}`
      : "dashboard"; // Default to "dashboard" if no folderPath is provided

    // Set the upload destination
    req.folderPath = path.join(__dirname, "../uploads", folderPath);
    await fs.ensureDir(req.folderPath); // Ensure the directory exists
    next();
  },
  upload.array("file"),
  async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send("User ID is missing");
    }

    const fileFolderPath = req.params.folderPath
      ? `uploads/${req.params.folderPath}`
      : "dashboard";
    const pagePath = req.params.folderPath
      ? `${req.params.folderPath}`
      : "dashboard";

    // Find or create the folder
    let folder = await prisma.folder.findUnique({
      where: {
        path: fileFolderPath,
      },
    });

    if (!folder && fileFolderPath !== "dashboard") {
      // Create the folder if it doesn't exist (except for the root "dashboard")
      folder = await prisma.folder.create({
        data: {
          name: path.basename(fileFolderPath),
          path: fileFolderPath,
          userId: parseInt(userId),
          parentId: null, // Set parentId to null for root folders
        },
      });
    }
    // console.log(req);
    // Create file records in the database
    const files = req.files.map((file) => ({
      filename: file.filename,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size,
      userId: parseInt(userId),
      folderId: folder ? folder.id : null, // Set folderId to null for root uploads
    }));

    await prisma.file.createMany({
      data: files,
    });

    res.redirect(`/${pagePath}`);
  }
);

module.exports = router;
