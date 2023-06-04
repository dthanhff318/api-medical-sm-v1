const express = require("express");
const storeController = require("../controllers/storeController");
const storeRoute = express.Router();

storeRoute.get("/", storeController.getSupplyFromStore);
storeRoute.post("/add", storeController.addSupplyToStore);
storeRoute.patch("/:id", storeController.updateSupply);
storeRoute.delete("/:id", storeController.deleteOneSupply);

// Department
storeRoute.get("/department/:id", storeController.getSupplyOfDepartment);

module.exports = storeRoute;
