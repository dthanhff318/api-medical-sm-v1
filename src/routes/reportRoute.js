const express = require("express");
const reportController = require("../controllers/reportController");
const reportRoute = express.Router();

reportRoute.post(
  "/export-department",
  reportController.getReportExportToDepartment
);
reportRoute.post("/import-department", reportController.getReportImport);
reportRoute.post("/inventory-store", reportController.getReportInventory);
reportRoute.post("/bidding", reportController.getReportBidding);

module.exports = reportRoute;
