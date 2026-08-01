const multer = require("multer");

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop(); // extension
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "." + ext); // nom court et propre
  }
});


const uploadImage = multer({ storage,  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Mo max
  } });

module.exports = uploadImage;
