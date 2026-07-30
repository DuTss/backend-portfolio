const multer = require("multer");

// Stockage en mémoire (recommandé si tu traites ensuite l'image)
const storage = multer.memoryStorage();

// Liste des MIME types autorisés
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/x-icon"
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("FORMAT_NON_AUTORISE : Le fichier doit être une image."), false);
  }
};

const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Mo max
  }
});

module.exports = uploadImage;
