const express = require("express");
const reportController = require("../controllers/reportController");
const reportRoute = express.Router();

reportRoute.post(
  "/export-department",
  reportController.getReportExportToDepartment
);
reportRoute.post(
  "/refund-department",
  reportController.getReportRefundFromDepartment
);
reportRoute.post("/inventory-store", reportController.getReportInventory);

module.exports = reportRoute;
