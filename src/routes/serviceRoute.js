const express = require("express");
const serviceController = require("../controllers/serviceController");
const serviceRoute = express.Router();

serviceRoute.get("/", serviceController.getCommonData);

module.exports = serviceRoute;
