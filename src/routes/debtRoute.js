const express = require("express");
const debtController = require("../controllers/debtController");
const debtRoute = express.Router();

debtRoute.post("/", debtController.getListDebt);

module.exports = debtRoute;
