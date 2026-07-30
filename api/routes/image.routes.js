const express = require("express");
const router = express.Router();
const uploadImage = require("../middleware/uploadImage");
const imageController = require("../controllers/image.controller");

router.post("/upload", uploadImage.single("image"), imageController.upload);

module.exports = router;
