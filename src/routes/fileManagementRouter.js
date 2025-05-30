const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

router.delete("/dashboard/delete/:fileId", fileController.deleteFile);

module.exports = router;
