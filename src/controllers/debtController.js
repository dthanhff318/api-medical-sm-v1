const Group = require("../models/group.model");
const Bidding = require("../models/bidding.model");
const Store = require("../models/store.model");
const { pickQuery } = require("../utilities/func");
const { HTTPStatusCode } = require("../constants");
const HistoryBidding = require("../models/historyBidding.model");

const debtController = {
  getListDebt: async (req, res) => {
    const { q = "", page = 1, limit = 10 } = req.query;
    const calculatePage = (page - 1) * limit;
    const listDebt = await HistoryBidding.find({});
    return res.status(HTTPStatusCode.OK).json(listDebt);
  },
};

module.exports = debtController;
