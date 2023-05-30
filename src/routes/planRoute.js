const express = require("express");
const planController = require("../controllers/planController");
const planRoute = express.Router();

planRoute.post("/", planController.sendPlan);
planRoute.get("/expect/:id", planController.expectPlan);
planRoute.get("/refund/:id", planController.refundPlan);
planRoute.get("/", planController.getPlans);
planRoute.get("/:id", planController.getPlanDetail);
planRoute.delete("/:id", planController.deletePlan);

module.exports = planRoute;
