const Bidding = require("../models/bidding.model");
const { HTTPStatusCode } = require("../constants");

const biddingController = {
  updateBiddingList: async (req, res) => {
    try {
      const dataBidding = req.body.bidding;
      const data = dataBidding.map((b) => new Bidding(b));
      const saved = data.map((d) => d.save());
      const result = await Promise.all(saved);
      return res.status(HTTPStatusCode.OK).json(result);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = biddingController;
