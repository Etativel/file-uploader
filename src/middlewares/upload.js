require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// const storage = multer.diskStorage({
//   destination: async function (req, file, cb) {
//     const folderPath = req.folderPath;
//     await fs.ensureDir(folderPath);
//     cb(null, folderPath);
//   },
//   filename: function (req, file, cb) {
//     const originalName = file.originalname;
//     cb(null, originalName);
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "uploads", // Cloudinary folder
    // format: file.mimetype.split("/")[1],
    public_id: Date.now() + "-" + file.originalname, // Unique filename
  }),
});

const upload = multer({ storage });

module.exports = upload;
