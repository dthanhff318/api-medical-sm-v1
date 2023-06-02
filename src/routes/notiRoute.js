const express = require("express");
const notiController = require("../controllers/notiController");
const notiRoute = express.Router();

notiRoute.get("/", notiController.getNoti);
notiRoute.patch("/mark-as-seen", notiController.markAsSeenNoti);

module.exports = notiRoute;
