const { HTTPStatusCode } = require("../constants");
const Store = require("../models/store.model");
const Department = require("../models/department.model");
const Supplier = require("../models/supplier.model");

const serviceController = {
  getCommonData: async (req, res) => {
    try {
      let date = new Date();
      date.setDate(date.getDate() + 30);
      const totalSupply = await Store.countDocuments({});
      const totalDepartment = await Department.countDocuments({});
      const totalSupplier = await Supplier.countDocuments({});
      const totalSupplyExpired = await Store.find({
        dataExpired: { $gte: date },
      });
      const response = {
        supply: totalSupply,
        department: totalDepartment,
        supplier: totalSupplier,
      };
      return res.status(HTTPStatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = serviceController;
