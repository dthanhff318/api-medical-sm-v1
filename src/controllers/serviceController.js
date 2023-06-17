const { HTTPStatusCode } = require("../constants");
const moment = require("moment");
const Store = require("../models/store.model");
const Department = require("../models/department.model");
const Supplier = require("../models/supplier.model");
const Group = require("../models/group.model");
const Unit = require("../models/unit.model");

const serviceController = {
  getCommonData: async (req, res) => {
    try {
      const { day = 30 } = req.query;
      let date = new Date();
      date.setDate(date.getDate() + 30);
      const totalSupply = await Store.countDocuments({});
      const totalDepartment = await Department.countDocuments({});
      const totalSupplier = await Supplier.countDocuments({});
      const listSupply = await Store.find({
        dateExpired: { $ne: "" },
      });
      const listSupplyWillExpired = listSupply.filter((s) => {
        const expiredDate = moment(s.dateExpired, "MMM DD[th] YY");
        const now = moment();
        const diffDays = -now.diff(expiredDate, "days");
        return diffDays < day;
      });

      const response = {
        supply: totalSupply,
        department: totalDepartment,
        supplier: totalSupplier,
        listSuppliesExpired: listSupplyWillExpired,
      };
      return res.status(HTTPStatusCode.OK).json(response);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getInfoAboutSupply: async (req, res) => {
    try {
      const groups = await Group.find({});
      const units = await Unit.find({});
      const suppliers = await Supplier.find({});
      return res.status(HTTPStatusCode.OK).json({
        groups,
        units,
        suppliers,
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = serviceController;
