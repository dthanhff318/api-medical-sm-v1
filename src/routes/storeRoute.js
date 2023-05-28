const express = require("express");
const storeController = require("../controllers/storeController");
const storeRoute = express.Router();

storeRoute.get("/", storeController.getSupplyFromStore);
storeRoute.get("/department/:id", storeController.getSupplyOfDepartment);
storeRoute.post("/add", storeController.addSupplyToStore);
storeRoute.delete("/:id", storeController.deleteOneSupply);

module.exports = storeRoute;
