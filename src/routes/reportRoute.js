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

module.exports = reportRoute;
