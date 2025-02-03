const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const folderPath = req.folderPath || "uploads/dashboard";
    await fs.ensureDir(folderPath);
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    cb(null, originalName);
  },
});

const upload = multer({ storage });

module.exports = upload;
