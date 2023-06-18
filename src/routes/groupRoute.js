const express = require("express");
const unitController = require("../controllers/unitController");
const groupRoute = express.Router();

groupRoute.get("/", unitController.getUnits);
groupRoute.post("/", unitController.createUnit);
groupRoute.patch("/:id", unitController.updateUnit);
groupRoute.delete("/:id", unitController.deleteUnit);

module.exports = groupRoute;
