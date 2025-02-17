const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const upload = require("../middlewares/multer");
const fs = require("fs-extra");

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/dashboard/*/upload",
  (req, res, next) => {
    upload.array("file")(req, res, (err) => {
      if (err) {
        if (err.message === "File extension not allowed") {
          return res.status(400).json({
            error: "File type not allowed. Please upload a valid file.",
          });
        }
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size exceeds the 10MB limit." });
        }
        return res
          .status(500)
          .json({ error: "An error occurred during file upload." });
      }
      next();
    });
  },
  async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).send("User ID is missing");

    const fileFolderPath = `uploads/${req.params["0"] || "dashboard"}`.replace(
      /\/$/,
      ""
    );
    const pagePath = `${req.params["0"] || ""}`.replace(/\/$/, "");
    let updatedPagePath = pagePath.replace(/(dashboard)-\d+/, "$1");

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

    const files = req.files;
    console.log(files);
    const fileData = files.map((file) => ({
      filename: file.filename,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size,
      userId: parseInt(userId),
      folderId: folder ? folder.id : null,
    }));
    await prisma.file.createMany({ data: fileData });

    res.redirect(`/${updatedPagePath}`);
  }
);

module.exports = router;
