const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is logged in
router.use((req, res, next) => {
  if (!req.user) {
    return res.redirect("/"); // Redirect if the user is not logged in
  }
  next();
});

// Route for handling folder navigation
router.get("/:folderPath(*)", async (req, res) => {
  console.log(req.params);
  const folderPath = req.params.folderPath;

  // Ensure the route only runs for "dashboard" or subfolders inside it
  // if (!folderPath.startsWith("dashboard")) {
  //   return res.status(404).send("Page not found");
  // }

  const fullPath = `uploads/dashboard-${req.user.id}/${folderPath}`.replace(
    /\/$/,
    ""
  );
  // Check if the dashboard folder exists
  let dashboardFolder = await prisma.folder.findUnique({
    where: { path: `uploads/dashboard-${req.user.id}` },
  });

  if (!dashboardFolder) {
    // If the dashboard folder doesn't exist, create it
    await prisma.folder.create({
      data: {
        name: "dashboard",
        path: `uploads/dashboard-${req.user.id}`,
        parentId: null,
        userId: req.user.id,
      },
    });
  }

  // Fetch the requested folder and its subfolders/files
  const folder = await prisma.folder.findUnique({
    where: { path: fullPath },
    include: { subfolders: true, files: true },
  });

  // If the folder doesn't exist, return a 404
  console.log(fullPath);
  if (!folder) {
    return res.status(404).send("Folder not found");
  }
  console.log(folder);
  // Render the dashboard view with the folder data
  res.render("dashboard", {
    local: req.user,
    folder,
  });
});

module.exports = router;
