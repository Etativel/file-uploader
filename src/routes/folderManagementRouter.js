const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folderController.js");

router.delete(
  "/dashboard/delete-folder/:folderId",
  folderController.deleteFolder
);

module.exports = router;
