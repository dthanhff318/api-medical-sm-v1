const express = require("express");
const supplierController = require("../controllers/supplierController");
const supplierRoute = express.Router();

// supplierRoute.get("/", supplierController.getBidding);
supplierRoute.get("/search", supplierController.findSupplier);

module.exports = supplierRoute;
