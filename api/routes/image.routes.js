const express = require("express");
const router = express.Router();
const uploadImage = require("../middleware/uploadImage");

router.post("/upload", uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image reçue" });
  }

  res.json({
    message: "Image uploadée",
    path: "/uploads/" + req.file.filename
  });
});

module.exports = router;
