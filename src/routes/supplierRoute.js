const express = require("express");
const supplierController = require("../controllers/supplierController");
const supplierRoute = express.Router();

supplierRoute.get("/", supplierController.getSupplier);
supplierRoute.get("/:id", supplierController.getDetailSupplier);
supplierRoute.get("/search", supplierController.findSupplier);
supplierRoute.delete("/:id", supplierController.deleteSupplier);

module.exports = supplierRoute;
