const { pickQuery } = require("../utilities/func");
const { HTTPStatusCode } = require("../constants");
const moment = require("moment");
const HistoryBidding = require("../models/historyBidding.model");

const debtController = {
  getListDebt: async (req, res) => {
    try {
      const { timeRange, search = "", ...dataQuery } = req.body;
      const objQuery = pickQuery(dataQuery);
      const listDebt = await HistoryBidding.find({
        codeBill: { $regex: search, $options: "i" },
        ...objQuery,
      });
      const startDate = moment(timeRange[0], "DD MM YY");
      const endDate = moment(timeRange[1], "DD MM YY");
      const listDebtFilterTime = listDebt.filter((e) => {
        const timeSend = moment(e.createdTime, "DD MM YYYY");
        return timeSend.isBetween(startDate, endDate);
      });
      return res.status(HTTPStatusCode.OK).json(listDebtFilterTime);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = debtController;
