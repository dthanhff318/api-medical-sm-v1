const fileUploader = require("../config/cloudinaryConfig");

const uploadServices = {
  uploadFile: (name) => fileUploader.single(name),
};

module.exports = uploadServices;
