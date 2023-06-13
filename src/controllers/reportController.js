const Bidding = require("../models/bidding.model");
const Plan = require("../models/plan.model");
const { HTTPStatusCode } = require("../constants");

const reportController = {
  getReportExportToDepartment: async (req, res) => {
    try {
      const { timeRange, department } = req.body;
      console.log(timeRange);
      const listTicket = await Plan.find();
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = reportController;
