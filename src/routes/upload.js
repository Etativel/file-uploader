const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const upload = require("../middlewares/upload");
const fs = require("fs-extra");

const router = express.Router();
const prisma = new PrismaClient();

// router.post(
//   "/dashboard/upload",
//   async (req, res, next) => {
//     const folderPath = req.params.folderPath
//       ? `${req.params.folderPath}`
//       : "dashboard"; // Default to "dashboard" if no folderPath is provided

//     // Set the upload destination
//     req.folderPath = path.join(__dirname, "../uploads", folderPath);
//     await fs.ensureDir(req.folderPath); // Ensure the directory exists
//     next();
//   },
//   upload.array("file"),
//   async (req, res) => {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).send("User ID is missing");
//     }

//     const fileFolderPath = req.params.folderPath
//       ? `uploads/${req.params.folderPath}`
//       : "dashboard";

//     const pagePath = req.params.folderPath
//       ? `${req.params.folderPath}`
//       : "dashboard";

//     // Find or create the folder
//     let folder = await prisma.folder.findUnique({
//       where: {
//         path: fileFolderPath,
//       },
//     });

//     if (!folder && fileFolderPath !== "dashboard") {
//       // Create the folder if it doesn't exist (except for the root "dashboard")
//       folder = await prisma.folder.create({
//         data: {
//           name: path.basename(fileFolderPath),
//           path: fileFolderPath,
//           userId: parseInt(userId),
//           parentId: null, // Set parentId to null for root folders
//         },
//       });
//     }
//     // console.log(req);
//     // Create file records in the database
//     console.log("ini req. files", req.files);
//     console.log("ini path dari upload", req.params);
//     const files = req.files.map((file) => ({
//       filename: file.filename,
//       filepath: file.path,
//       mimetype: file.mimetype,
//       size: file.size,
//       userId: parseInt(userId),
//       folderId: folder ? folder.id : null, // Set folderId to null for root uploads
//     }));

//     await prisma.file.createMany({
//       data: files,
//     });

//     res.redirect(`/${pagePath}`);
//   }
// );

// router.post(
//   "/dashboard/:folderPath*/upload", // Allow nested folders
//   async (req, res, next) => {
//     const folderPath = req.params.folderPath
//       ? `dashboard/${req.params.folderPath}`
//       : "dashboard"; // Default to "dashboard" if no folderPath is provided

//     req.folderPath = path.join(__dirname, "../uploads", folderPath);
//     await fs.ensureDir(req.folderPath); // Ensure the directory exists
//     next();
//   },
//   upload.array("file"),
//   async (req, res) => {
//     const { userId } = req.body;
//     if (!userId) return res.status(400).send("User ID is missing");

//     const fileFolderPath = `uploads/dashboard/${
//       req.params.folderPath || ""
//     }`.replace(/\/$/, "");
//     const pagePath = `dashboard/${req.params.folderPath || ""}`.replace(
//       /\/$/,
//       ""
//     );

//     let folder = await prisma.folder.findUnique({
//       where: { path: fileFolderPath },
//     });

//     if (!folder && fileFolderPath !== "uploads/dashboard") {
//       folder = await prisma.folder.create({
//         data: {
//           name: path.basename(fileFolderPath),
//           path: fileFolderPath,
//           userId: parseInt(userId),
//           parentId: null,
//         },
//       });
//     }

//     console.log("ini req.files", req.files);
//     console.log("ini path dari upload", req.params);

//     const files = req.files.map((file) => ({
//       filename: file.filename,
//       filepath: file.path,
//       mimetype: file.mimetype,
//       size: file.size,
//       userId: parseInt(userId),
//       folderId: folder ? folder.id : null,
//     }));

//     await prisma.file.createMany({ data: files });

//     res.redirect(`/${pagePath}`);
//   }
// );

router.post(
  "/dashboard/*/upload",
  // Capture any subfolder inside dashboard
  async (req, res, next) => {
    //Use '0' instead of folderPath
    const folderPath = req.params["0"]
      ? `dashboard/${req.params["0"]}`
      : "dashboard";
    // Default to "dashboard" if no folderPath is provided

    req.folderPath = path.join(__dirname, "../uploads", folderPath);
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

    let folder = await prisma.folder.findUnique({
      where: { path: fileFolderPath },
    });

    if (!folder && fileFolderPath !== "uploads/dashboard") {
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

    res.redirect(`/${pagePath}`);
  }
);

module.exports = router;
