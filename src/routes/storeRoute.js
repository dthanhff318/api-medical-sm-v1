const express = require("express");
const storeController = require("../controllers/storeController");
const storeRoute = express.Router();

storeRoute.get("/", storeController.getSupplyFromStore);
storeRoute.post("/add", storeController.addSupplyToStore);

module.exports = storeRoute;
