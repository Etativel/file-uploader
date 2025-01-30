const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  res.json(req.user);
});

module.exports = router;
