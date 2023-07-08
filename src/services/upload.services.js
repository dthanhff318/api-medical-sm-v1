const { uploadCloud, deleteImage } = require("../config/cloudinaryConfig");

const uploadServices = {
  uploadFile: (name) => uploadCloud.single(name),
  deleteFile: async (id) => await deleteImage(id),
};

module.exports = uploadServices;
