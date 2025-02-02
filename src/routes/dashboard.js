const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

router.get("/:folderPath(*)", async (req, res) => {
  // console.log(req.params);
  const folderPath = req.params.folderPath
    ? `uploads/${req.params.folderPath}`
    : "dashboard"; // Default to "dashboard" if no folderPath is provided
  // console.log(folderPath);
  const folder = await prisma.folder.findUnique({
    where: { path: folderPath },
    include: { subfolders: true, files: true },
  });
  console.log(folder);
  if (!folder) {
    return res.status(404).send("Folder not found");
  }

  res.render("dashboard", {
    local: req.user,
    folder,
  });
});

module.exports = router;
