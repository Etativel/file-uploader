// const express = require("express");
// const router = express.Router();
// const cloudinary = require("../config/cloudinaryConfig");
// const moment = require("moment");

// router.get("/generate-link/:publicId", (req, res) => {
//   const { publicId } = req.params;
//   const expirationTime = moment().add(1, "hour");
//   const signedUrl = cloudinary.utils.download_archive_url({
//     public_ids: [publicId],
//     type: "authenticated",
//     resource_type: "raw",
//     expires_at: expirationTime.unix(),
//   });

//   downloadLinks[signedUrl] = expirationTime;

//   res.json({
//     message: "Shareable download link generated",
//     downloadLink: signedUrl,
//   });
// });

// router.get("/download/:publicId", (req, res) => {
//   const { publicId } = req.params;

//   const signedUrl = Object.keys(downloadLinks).find((url) =>
//     url.includes(publicId)
//   );

//   if (signedUrl) {
//     const expirationTime = downloadLinks[signedUrl];

//     if (moment().isAfter(expirationTime)) {
//       return res.redirect("/expired");
//     } else {
//       return res.redirect(signedUrl);
//     }
//   }

//   return res.status(404).json({ error: "File not found or link expired" });
// });

// // Expired page route
// router.get("/expired", (req, res) => {
//   res.send("<h1>The download link has expired. Please request a new one.</h1>");
// });

// module.exports = router;
