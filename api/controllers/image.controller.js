const Project = require("../models/Project");

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "AUCUN_FICHIER",
        message: "Veuillez fournir une image valide."
      });
    }

    // Convertir l'image en base64
    const base64Image = req.file.buffer.toString("base64");
    console.log("FILE OBJECT:", req.file);

    // Retourner l'image encodée
    res.json({
      message: "Image uploadée avec succès",
      mimetype: req.file.mimetype,
      image: base64Image
    });

  } catch (err) {
    res.status(500).json({
      error: "UPLOAD_ERROR",
      message: err.message
    });
  }
};
