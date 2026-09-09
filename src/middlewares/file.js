const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "adminUser-thePower",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
});

const upload = multer({ storage });

module.exports = { upload };