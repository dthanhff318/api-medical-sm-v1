const express = require("express");
const planController = require("../controllers/planController");
const planRoute = express.Router();

planRoute.post("/", planController.sendPlan);
planRoute.get("/accept/:id", planController.acceptPlan);
planRoute.get("/", planController.getPlans);
planRoute.get("/:id", planController.getPlanDetail);
planRoute.delete("/:id", planController.deletePlan);

module.exports = planRoute;
