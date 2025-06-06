const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is logged in
router.use((req, res, next) => {
  if (!req.user) {
    return res.redirect("/");
  }
  next();
});

// Route for handling folder navigation
router.get("/:folderPath(*)", async (req, res) => {
  const folderPath = req.params.folderPath;
  // const folderId = req.params.id
  // console.log(req.body);
  const fullPath = `uploads/dashboard-${req.user.id}/${folderPath}`.replace(
    /\/$/,
    ""
  );
  let dashboardFolder = await prisma.folder.findUnique({
    where: { path: `uploads/dashboard-${req.user.id}` },
  });

  if (!dashboardFolder) {
    await prisma.folder.create({
      data: {
        name: "dashboard",
        path: `uploads/dashboard-${req.user.id}`,
        parentId: null,
        userId: req.user.id,
      },
    });
  }

  // const folder = await prisma.folder.findUnique({
  //   where: { path: fullPath },
  //   include: {
  //     subfolders: true,
  //     files: {
  //       orderBy: {
  //         uploadedAt: "desc",
  //       },
  //     },
  //   },
  // });

  const folder = await prisma.folder.findUnique({
    where: { path: fullPath },
    select: {
      id: true,
      name: true,
      path: true,
      userId: true,
      parentId: true,
      subfolders: {
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          name: true,
          path: true,
          userId: true,
          parentId: true,
        },
      },
      files: {
        orderBy: {
          uploadedAt: "desc",
        },
        select: {
          id: true,
          filename: true,
          filepath: true,
          mimetype: true,
          size: true,
          uploadedAt: true,
          userId: true,
          folderId: true,
        },
      },
    },
  });

  if (!folder) {
    return res.status(404).send("Folder not found");
  }
  res.render("dashboard", {
    local: req.user,
    folder,
  });
});

module.exports = router;
