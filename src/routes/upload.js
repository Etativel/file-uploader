const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const upload = require("../middlewares/upload");
const fs = require("fs-extra");

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/dashboard/*/upload",
  // Capture any subfolder inside dashboard
  async (req, res, next) => {
    //Use '0' instead of folderPath
    const folderPath = req.params["0"] ? `${req.params["0"]}` : "dashboard";
    // Default to "dashboard" if no folderPath is provided
    console.log(req.params);
    req.folderPath = path.join(__dirname, "../uploads", folderPath);
    // This will create folder that didn't exist when user trying to upload to it, instead of creating it via folder.
    // The folder routes will only create the folder in the database
    await fs.ensureDir(req.folderPath);
    next();
  },
  upload.array("file"),
  async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).send("User ID is missing");

    const fileFolderPath = `uploads/${req.params["0"] || "dashboard"}`.replace(
      /\/$/,
      ""
    );
    const pagePath = `${req.params["0"] || ""}`.replace(/\/$/, "");
    let updatedPagePath = pagePath.replace(/(dashboard)-\d+/, "$1");
    // console.log(pagePath);

    let folder = await prisma.folder.findUnique({
      where: { path: fileFolderPath },
    });

    if (!folder && fileFolderPath !== `uploads/dashboard-${req.user.id}`) {
      folder = await prisma.folder.create({
        data: {
          name: path.basename(fileFolderPath),
          path: fileFolderPath,
          userId: parseInt(userId),
          parentId: null,
        },
      });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size,
      userId: parseInt(userId),
      folderId: folder ? folder.id : null,
    }));

    await prisma.file.createMany({ data: files });

    res.redirect(`/${updatedPagePath}`);
  }
);

module.exports = router;
