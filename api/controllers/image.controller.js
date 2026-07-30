exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "AUCUN_FICHIER",
        message: "Veuillez fournir une image valide."
      });
    }

    // Ici tu peux sauvegarder l'image :
    // - Cloudinary
    // - AWS S3
    // - FileSystem local
    // - Base64 → MongoDB
    // etc.

    res.json({
      message: "Image uploadée avec succès",
      mimetype: req.file.mimetype,
      size: req.file.size
    });

  } catch (err) {
    res.status(500).json({
      error: "UPLOAD_ERROR",
      message: err.message
    });
  }
};
