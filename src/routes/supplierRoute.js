const express = require("express");
const supplierController = require("../controllers/supplierController");
const supplierRoute = express.Router();

supplierRoute.get("/", supplierController.getSupplier);
supplierRoute.get("/search", supplierController.findSupplier);
supplierRoute.get("/:id", supplierController.getDetailSupplier);
supplierRoute.patch("/:id", supplierController.updateSupplier);
supplierRoute.delete("/:id", supplierController.deleteSupplier);

module.exports = supplierRoute;
