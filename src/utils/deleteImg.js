const cloudinary = require("cloudinary").v2;

const deleteImgCloudinary = async (imgUrl) => {
    try {
        // extrae el public_id de la URL de cloudinary
        const urlParts  = imgUrl.split("/");
        const folder    = urlParts[urlParts.length - 2];
        const fileName  = urlParts[urlParts.length - 1].split(".")[0];
        const publicId  = `${folder}/${fileName}`;

        await cloudinary.uploader.destroy(publicId);
        console.log("Imagen eliminada de Cloudinary:", publicId);
    } catch (error) {
        console.error("Error eliminando imagen de Cloudinary:", error.message);
    }
};

module.exports = { deleteImgCloudinary };