require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "uploads",
    public_id: Date.now() + "-" + file.originalname,
  }),
});

const forbiddenExtensions = [
  "action",
  "apk",
  "app",
  "bat",
  "bin",
  "cmd",
  "com",
  "command",
  "cpl",
  "csh",
  "exe",
  "gadget",
  "inf1",
  "ins",
  "inx",
  "ipa",
  "isu",
  "job",
  "jse",
  "ksh",
  "lnk",
  "msc",
  "msi",
  "msp",
  "mst",
  "osx",
  "out",
  "paf",
  "pif",
  "prg",
  "ps1",
  "reg",
  "rgs",
  "run",
  "sct",
  "shb",
  "shs",
  "u3p",
  "vb",
  "vbe",
  "vbs",
  "vbscript",
  "workflow",
  "ws",
  "wsf",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (forbiddenExtensions.includes(ext)) {
    return cb(new Error("File extension not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
