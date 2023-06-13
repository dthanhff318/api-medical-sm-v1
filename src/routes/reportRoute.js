const express = require("express");
const serviceController = require("../controllers/serviceController");
const reportRoute = express.Router();

reportRoute.get("/", serviceController.getCommonData);

module.exports = reportRoute;
