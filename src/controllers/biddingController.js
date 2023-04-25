const { HTTPStatusCode } = require("../constants");

const biddingController = {
  updateBiddingList: async (req, res) => {
    try {
      const dataBidding = req.body.bidding;

      return res.status(HTTPStatusCode.OK).json("hih");
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = biddingController;
