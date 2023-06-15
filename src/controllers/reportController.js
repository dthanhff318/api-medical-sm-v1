const moment = require("moment");
const Plan = require("../models/plan.model");
const Store = require("../models/store.model");
const Department = require("../models/department.model");
const { HTTPStatusCode } = require("../constants");

const reportController = {
  getReportExportToDepartment: async (req, res) => {
    try {
      const { timeRange, department, typePlan } = req.body;
      const startDate = moment(timeRange[0], "DD MM YY");
      const endDate = moment(timeRange[1], "DD MM YY");
      const objQuery = { department };
      if (typePlan === 1 || typePlan === 2) {
        objQuery.typePlan = typePlan;
      }
      const listTicket = await Plan.find(objQuery);
      const departmentDetail = await Department.findById(department);
      const historyExport = listTicket
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MMM YYYY");
          return timeSend.isBetween(startDate, endDate);
        })
        .reduce((acc, cur) => [...acc, ...cur.planList], []);
      const listSupply = await Store.find({}).populate({
        path: "company",
        model: "Supplier",
        select: "name",
      });
      const historyExportDetail = historyExport.map((e) => {
        const findSupplyStore = listSupply.find((d) => d._id === e.id);
        if (!findSupplyStore) {
          return {};
        }
        const { _id, yearBidding, __v, codeBidding, ...rest } =
          findSupplyStore._doc;
        return { ...rest, id: e.id, quantityExpect: e.quantity };
      });
      return res.status(HTTPStatusCode.OK).json({
        historyDetail: historyExportDetail,
        departrment: departmentDetail,
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getReportRefundFromDepartment: async (req, res) => {
    try {
      const { timeRange, department, typePlan } = req.body;
      const startDate = moment(timeRange[0], "DD MM YY");
      const endDate = moment(timeRange[1], "DD MM YY");
      const objQuery = { department };
      if (typePlan === 3 || typePlan === 4) {
        objQuery.typePlan = typePlan;
      } else {
        objQuery.typePlan = { $in: [3, 4] };
      }
      const listTicket = await Plan.find(objQuery);
      const departmentDetail = await Department.findById(department);
      const historyExport = listTicket
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MMM YYYY");
          return timeSend.isBetween(startDate, endDate);
        })
        .reduce((acc, cur) => [...acc, ...cur.planList], []);
      const listSupply = await Store.find({}).populate({
        path: "company",
        model: "Supplier",
        select: "name",
      });
      const historyExportDetail = historyExport.map((e) => {
        const findSupplyStore = listSupply.find((d) => d._id === e.id);
        if (!findSupplyStore) {
          return {};
        }
        const { _id, yearBidding, __v, codeBidding, ...rest } =
          findSupplyStore._doc;
        return { ...rest, id: e.id, quantityExpect: e.quantity };
      });
      return res.status(HTTPStatusCode.OK).json({
        historyDetail: historyExportDetail,
        departrment: departmentDetail,
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = reportController;
