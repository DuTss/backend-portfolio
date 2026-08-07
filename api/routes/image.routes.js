const express = require("express");
const router = express.Router();
const uploadImage = require("../middleware/uploadImage");
const fs = require("fs");

router.post("/upload", (req, res) => {
  uploadImage.single("image")(req, res, (err) => {

    // Fonction utilitaire pour supprimer le fichier si présent
    const deleteFileIfExists = () => {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
    };

    // 🔥 Erreur format interdit
    if (err && err.message === "FORMAT_NOT_ALLOWED") {
      deleteFileIfExists();
      return res.status(400).json({ message: "Format non autorisé" });
    }

    // 🔥 Erreur fichier trop lourd
    if (err && err.code === "LIMIT_FILE_SIZE") {
      deleteFileIfExists();
      return res.status(400).json({ message: "Fichier trop lourd (max 5 Mo)" });
    }

    // 🔥 Autre erreur Multer
    if (err) {
      deleteFileIfExists();
      return res.status(400).json({ message: "Erreur upload" });
    }

    // 🔥 Aucun fichier reçu
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image reçue" });
    }

    // 🔥 Succès
    res.json({
      message: "Image uploadée",
      path: "/uploads/" + req.file.filename
    });
  });
});

module.exports = router;
