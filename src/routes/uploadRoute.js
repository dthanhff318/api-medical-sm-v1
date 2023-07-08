const express = require("express");
const uploadServices = require("../services/upload.services");
const uploadController = require("../controllers/uploadController");
const { verifyToken } = require("../middlewares");
const uploadRoute = express.Router();

uploadRoute.post(
  "/avatar",
  verifyToken,
  uploadServices.uploadFile("file"),
  uploadController.uploadAvatarImage
);

uploadRoute.post(
  "/supplier/:id",
  uploadServices.uploadFile("file"),
  uploadController.uploadSupplierImage
);

module.exports = uploadRoute;
