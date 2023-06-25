const express = require("express");
const serviceController = require("../controllers/serviceController");
const serviceRoute = express.Router();

serviceRoute.get("/", serviceController.getCommonData);
serviceRoute.get("/info", serviceController.getInfoAboutSupply);
serviceRoute.post("/analysis", serviceController.getAnalysis);

module.exports = serviceRoute;
