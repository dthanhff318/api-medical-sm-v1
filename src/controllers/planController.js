const { HTTPStatusCode } = require("../constants");
const Plan = require("../models/plan.model");

const planController = {
  sendPlan: async (req, res) => {
    try {
      const data = req.body;
      const newPlan = new Plan(data);
      const planRes = await newPlan.save();
      return res.status(HTTPStatusCode.OK).json(planRes);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getPlans: async (req, res) => {
    try {
      const { department, typePlan } = req.query;
      const listPlans = await Plan.find({ department, typePlan });
      return res.status(HTTPStatusCode.OK).json(listPlans);
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
