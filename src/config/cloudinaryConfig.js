const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dehyltryf",
  api_key: "551392444219214",
  api_secret: "Y5ZHQRN3TWLign1aoIbujCzABUE",
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(error);
  }
};

const uploadCloud = multer({ storage });

module.exports = { uploadCloud, deleteImage };
