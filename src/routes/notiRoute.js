const express = require("express");
const notiController = require("../controllers/notiController");
const notiRoute = express.Router();

notiRoute.get("/", notiController.getNoti);

module.exports = notiRoute;
