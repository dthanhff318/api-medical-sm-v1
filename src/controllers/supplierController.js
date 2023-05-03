const User = require("../models/users.model");
const { HTTPStatusCode } = require("../constants");
const Supplier = require("../models/supplier.model");

const supplierController = {
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
};

module.exports = supplierController;
