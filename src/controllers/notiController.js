const { HTTPStatusCode } = require("../constants");
const Plan = require("../models/plan.model");

const notiController = {
  getNoti: async (req, res) => {
    const {} = req.query;
    const listNoti = await Noti.find();
    return res.status(HTTPStatusCode.OK).json();
  },
};

module.exports = notiController;
