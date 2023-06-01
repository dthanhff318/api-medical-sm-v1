const { HTTPStatusCode } = require("../constants");
const Supplier = require("../models/supplier.model");

const supplierController = {
  getSupplier: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const calculatePage = (page - 1) * limit;
      const supplier = await Supplier.find()
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
  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.params;
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