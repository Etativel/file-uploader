const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const storage = multer.diskStorage({
  destination: async function (req, res, cb) {
    const folderPath = req.folderPath || "uploads";
    await fs.ensureDir(folderPath);
    cb(null, folderPath);
  },
  filename: function (req, res, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
