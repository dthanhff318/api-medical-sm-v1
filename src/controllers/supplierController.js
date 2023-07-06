const { HTTPStatusCode } = require("../constants");
const Supplier = require("../models/supplier.model");
const Bidding = require("../models/bidding.model");
const Store = require("../models/store.model");

const supplierController = {
  createSupplier: async (req, res) => {
    try {
      const newSupplier = new Supplier(req.body);
      const departmentCreated = await newSupplier.save();
      return res.status(HTTPStatusCode.OK).json(departmentCreated);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getSupplier: async (req, res) => {
    try {
      const { page = 1, limit = 10, q = "" } = req.query;
      const calculatePage = (page - 1) * limit;
      const supplier = await Supplier.find({
        name: { $regex: q, $options: "i" },
      })
        .skip(calculatePage)
        .limit(Number(limit));
      const totalResults = await Supplier.countDocuments({});
      const totalPages = Math.ceil(totalResults / limit);
      return res.status(HTTPStatusCode.OK).json({
        results: supplier,
        pagination: {
          totalResults,
          totalPages,
          limit: Number(limit),
          page: Number(page),
        },
      });
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  findSupplier: async (req, res) => {
    try {
      const { q } = req.query;
      const findList = await Supplier.find({
        name: { $regex: q, $options: "i" },
      });
      return res.status(HTTPStatusCode.OK).json(findList);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  updateSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const dataUpdate = Object.entries(req.body).reduce((qrObj, q) => {
        if (q[1]) {
          return { ...qrObj, [q[0]]: q[1] };
        }
        return qrObj;
      }, {});
      const supplierUpdated = await Supplier.findByIdAndUpdate(id, dataUpdate, {
        new: true,
      });
      return res.status(HTTPStatusCode.OK).json(supplierUpdated);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      // Check allow delete
      const checkExistBidding = await Bidding.findOne({ company: id });
      if (checkExistBidding) {
        return res
          .status(HTTPStatusCode.BAD_REQUEST)
          .json("Company is being used, so you can't not delete it");
      }
      const checkExistStore = await Store.findOne({ company: id });
      if (checkExistStore) {
        return res
          .status(HTTPStatusCode.BAD_REQUEST)
          .json("Company is being used, so you can't not delete it");
      }
      const delSupplier = await Supplier.findByIdAndDelete(id, {
        returnOriginal: true,
      });
      return res.status(HTTPStatusCode.OK).json(delSupplier);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getDetailSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findById(id);
      return res.status(HTTPStatusCode.OK).json(supplier);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = supplierController;
