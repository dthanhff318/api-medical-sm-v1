const express = require("express");
const unitController = require("../controllers/unitController");
const unitRoute = express.Router();

unitRoute.get("/", unitController.getUnits);
unitRoute.post("/", unitController.createUnit);
unitRoute.patch("/:id", unitController.updateUnit);
unitRoute.delete("/:id", unitController.deleteUnit);

module.exports = unitRoute;
