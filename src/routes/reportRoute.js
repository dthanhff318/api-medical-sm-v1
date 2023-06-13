const express = require("express");
const reportController = require("../controllers/reportController");
const reportRoute = express.Router();

reportRoute.post(
  "/export-department",
  reportController.getReportExportToDepartment
);

module.exports = reportRoute;
