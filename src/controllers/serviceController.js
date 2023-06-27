const { HTTPStatusCode } = require("../constants");
const moment = require("moment");
const Store = require("../models/store.model");
const Department = require("../models/department.model");
const Supplier = require("../models/supplier.model");
const Group = require("../models/group.model");
const Unit = require("../models/unit.model");
const Plan = require("../models/plan.model");
const HistoryBidding = require("../models/historyBidding.model");
const {
  getTotalQuantityByMonth,
  getTotalQuantityExportByMonth,
  getTotalQuantityByMonthByGroup,
} = require("../utilities/func");

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
  getAnalysis: async (req, res) => {
    try {
      const { year } = req.body;
      const listGroup = await Group.find({});
      const listImportStore = await HistoryBidding.find({});
      const filterDataByYear = listImportStore.filter((e) =>
        e.createdTime.split("-").includes(year)
      );

      const dataFlowMonth = [];
      for (let i = 0; i < 12; i++) {
        dataFlowMonth.push({
          month: `Tháng ${i + 1}`,
          quantity: getTotalQuantityByMonth(
            filterDataByYear,
            String(i + 1).padStart(2, "0")
          ),
        });
      }

      const listTicketExport = await Plan.find({ typePlan: { $in: [1, 2] } });
      const filterTicketExportByYear = listTicketExport.filter((e) =>
        e.createdTime.split(" ").includes(year)
      );

      const dataExportFlowMonth = [];
      for (let i = 0; i < 12; i++) {
        dataExportFlowMonth.push({
          month: `Tháng ${i + 1}`,
          quantity: getTotalQuantityExportByMonth(
            filterTicketExportByYear,
            String(i + 1).padStart(2, "0")
          ),
        });
      }
      // Detail
      const dataImportDetail = [];
      for (const g of listGroup) {
        console.log(g);
        for (let i = 0; i < 12; i++) {
          dataImportDetail.push({
            month: `Tháng ${i + 1}`,
            quantity: getTotalQuantityByMonthByGroup(
              filterDataByYear,
              String(i + 1).padStart(2, "0"),
              g._id
            ),
            group: g.name,
          });
        }
      }
      // Classify
      const dataGroupClassify = [];
      for (const s of listGroup) {
        const listFilterByGroup = await Store.find({ group: s.id });
        const count = listFilterByGroup.reduce(
          (acc, cur) => (acc += cur.quantity),
          0
        );
        dataGroupClassify.push({
          count,
          name: s.name,
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        // dataImport: dataFlowMonth,
        // dataExport: dataExportFlowMonth,
        // dataGroupClassify,
        dataImportDetail,
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = serviceController;
