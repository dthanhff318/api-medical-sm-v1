const Unit = require("../models/unit.model");
const { pickQuery } = require("../utilities/func");
const { HTTPStatusCode } = require("../constants");
const Bidding = require("../models/bidding.model");
const Store = require("../models/store.model");

const unitController = {
  createUnit: async (req, res) => {
    try {
      const checkUnit = await Unit.findOne({ name: req.body.name });
      if (checkUnit) {
        return res
          .status(HTTPStatusCode.INTERNAL_SERVER_ERROR)
          .json("Unit have been already");
      }
      const newUnit = new Unit({
        ...req.body,
      });
      const unit = await newUnit.save();
      return res.status(HTTPStatusCode.OK).json(unit);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.OK).json(err);
    }
  },
  getUnits: async (req, res) => {
    const { q = "", page = 1, limit = 10 } = req.query;
    const calculatePage = (page - 1) * limit;
    const units = await Unit.find({
      name: { $regex: q, $options: "i" },
    })
      .skip(calculatePage)
      .limit(Number(limit));
    const totalResults = await Unit.countDocuments({});
    const totalPages = Math.ceil(totalResults / limit);
    return res.status(HTTPStatusCode.OK).json({
      results: units,
      pagination: {
        totalResults,
        totalPages,
        limit: Number(limit),
        page: Number(page),
      },
    });
  },
  updateUnit: async (req, res) => {
    const { id } = req.params;
    const dataUpdate = pickQuery(req.body);
    const updateUnit = await Unit.findByIdAndUpdate(id, dataUpdate, {
      new: true,
    });
    return res.status(HTTPStatusCode.OK).json(updateUnit);
  },

  deleteUnit: async (req, res) => {
    const { id } = req.params;
    // Check allow delete
    const checkExistBidding = await Bidding.findOne({ unit: id });
    if (checkExistBidding) {
      return res
        .status(HTTPStatusCode.BAD_REQUEST)
        .json("Unit is used, so you can't not delete it");
    }
    const checkExistStore = await Store.findOne({ unit: id });
    if (checkExistStore) {
      return res
        .status(HTTPStatusCode.BAD_REQUEST)
        .json("Unit is used, so you can't not delete it");
    }
    await Unit.findByIdAndDelete(id);
    return res.status(HTTPStatusCode.OK).json();
  },
};

module.exports = unitController;
