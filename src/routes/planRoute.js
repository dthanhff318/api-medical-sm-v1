const express = require("express");
const planController = require("../controllers/planController");
const planRoute = express.Router();

planRoute.post("/", planController.sendPlan);
planRoute.delete("/:id", planController.deletePlan);

module.exports = planRoute;
