const multer = require("multer");
const fs = require("fs");
const mime = require("mime-types");

// 🔥 Liste des MIME types autorisés
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

// 🔥 Storage Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = mime.extension(file.mimetype); // extension réelle
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}.${ext}`);
  }
});

// 🔥 Multer final
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("FORMAT_NOT_ALLOWED"));
    }
    cb(null, true);
  }
});

module.exports = uploadImage;
