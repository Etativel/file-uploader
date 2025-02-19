const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folderController");

router.post("/share-folder/:folderId", folderController.shareZipFolder);

module.exports = router;
