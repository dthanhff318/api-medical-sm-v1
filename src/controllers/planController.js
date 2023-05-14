const { HTTPStatusCode } = require("../constants");
const Plan = require("../models/plan.model");

const planController = {
  sendPlan: async (req, res) => {
    try {
      const data = req.body;
      return res.status(HTTPStatusCode.OK).json(data);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  deletePlan: async (req, res) => {
    try {
      const { id } = req.params;
      return res.status(HTTPStatusCode.OK).json(id);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = planController;
