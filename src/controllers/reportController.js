const Bidding = require("../models/bidding.model");
const { HTTPStatusCode } = require("../constants");
const Supplier = require("../models/supplier.model");

const reportController = {
  getBidding: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const calculatePage = (page - 1) * limit;
      const biddingData = await Bidding.find({})
        .skip(calculatePage)
        .limit(Number(limit))
        .populate({
          path: "company",
          model: "Supplier",
          select: "name",
        });
      const totalResults = await Bidding.countDocuments({});
      const totalPages = Math.ceil(totalResults / limit);
      return res.status(HTTPStatusCode.OK).json({
        results: biddingData,
        pagination: {
          totalResults,
          totalPages,
          limit: Number(limit),
          page: Number(page),
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = reportController;
