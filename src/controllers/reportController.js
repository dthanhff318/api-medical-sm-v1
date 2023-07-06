const moment = require("moment");
const Plan = require("../models/plan.model");
const Store = require("../models/store.model");
const Group = require("../models/group.model");
const Department = require("../models/department.model");
const { HTTPStatusCode } = require("../constants");
const HistoryBidding = require("../models/historyBidding.model");

const reportController = {
  getReportExportToDepartment: async (req, res) => {
    try {
      const { timeRange, department, typePlan, group } = req.body;
      for (const g of group) {
        const checkAvailableGroup = await Group.findById(g);
        if (!checkAvailableGroup) {
          return res.status(HTTPStatusCode.NOT_FOUND).json("Group not found");
        }
      }
      for (const d of department) {
        const checkAvailableDepartment = await Department.findById(d);
        if (!checkAvailableDepartment) {
          return res
            .status(HTTPStatusCode.NOT_FOUND)
            .json("Department not found");
        }
      }
      const startDate = moment(timeRange[0], "DD MM YY");
      const endDate = moment(timeRange[1], "DD MM YY");
      const listTicket = await Plan.find({
        department: { $in: department },
        typePlan: { $in: typePlan },
        isAccepted: true,
      });
      const historyExport = listTicket
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MMM YYYY");
          return timeSend.isBetween(startDate, endDate);
        })
        .reduce((acc, cur) => [...acc, ...cur.planList], [])
        .reduce((acc, cur) => {
          const exist = acc.find((a) => a.id === cur.id);
          if (exist) {
            exist.quantity += cur.quantity;
          } else {
            acc.push(cur);
          }
          return acc;
        }, []);
      const listSupply = await Store.find({})
        .populate({
          path: "company",
          model: "Supplier",
          select: "name",
        })
        .populate({
          path: "group",
          model: "Group",
          select: "name",
        })
        .populate({
          path: "unit",
          model: "Unit",
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
      const historyExportFilterByGroup = historyExportDetail.filter((e) =>
        group.includes(e.group._id)
      );
      return res.status(HTTPStatusCode.OK).json(historyExportFilterByGroup);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getReportImport: async (req, res) => {
    try {
      const { timeRange, group } = req.body;
      for (const g of group) {
        const checkAvailableGroup = await Group.findById(g);
        if (!checkAvailableGroup) {
          return res.status(HTTPStatusCode.NOT_FOUND).json("Group not found");
        }
      }

      const startDate = moment(timeRange[0], "DD MM YY");
      const endDate = moment(timeRange[1], "DD MM YY");
      const listTicket = await Plan.find({
        typePlan: { $in: [3, 4] },
        isAccepted: true,
      });
      const historyImport = listTicket
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MMM YYYY");
          return timeSend.isBetween(startDate, endDate);
        })
        .reduce((acc, cur) => [...acc, ...cur.planList], [])
        .reduce((acc, cur) => {
          const exist = acc.find((a) => a.id === cur.id);
          if (exist) {
            exist.quantity += cur.quantity;
          } else {
            acc.push(cur);
          }
          return acc;
        }, []);

      const listFromBidding = await HistoryBidding.find({});

      const listFromBiddingFilterTime = listFromBidding
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MM YYYY");
          return timeSend.isBetween(startDate, endDate);
        })
        .reduce((acc, cur) => [...acc, ...cur.data], [])
        .reduce((acc, cur) => {
          const exist = acc.find((a) => a.code === cur.code);
          if (exist) {
            exist.quantity += cur.quantity;
          } else {
            acc.push(cur);
          }
          return acc;
        }, []);
      const listSupply = await Store.find({});
      const historyImportDetail = historyImport.map((e) => {
        const findSupplyStore = listSupply.find((d) => d.id == e.id);
        if (!findSupplyStore) {
          return {};
        }
        const { _id, yearBidding, __v, codeBidding, ...rest } =
          findSupplyStore._doc;
        return { ...rest, id: e.id, quantityImport: e.quantity };
      });
      listFromBiddingFilterTime.forEach((q) => {
        const exist = historyImportDetail.find((x) => x.code == q.code);
        if (exist) {
          exist.quantityImport = exist.quantityImport + q.quantity;
        } else {
          historyImportDetail.push({
            ...q,
            quantityImport: q.quantity,
          });
        }
      });

      const historyImportFilterByGroup = historyImportDetail.filter((e) =>
        group.includes(e.group)
      );
      return res.status(HTTPStatusCode.OK).json(historyImportFilterByGroup);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getReportInventory: async (req, res) => {
    try {
      const { timeRange, group } = req.body;
      for (const g of group) {
        const checkAvailableGroup = await Group.findById(g);
        if (!checkAvailableGroup) {
          return res.status(HTTPStatusCode.NOT_FOUND).json("Group not found");
        }
      }

      const startDate = moment(timeRange[0], "DD MM YY");
      const endDate = moment(timeRange[1], "DD MM YY");
      const listTicket = await Plan.find({
        isAccepted: true,
      });

      const listHistoryBidding = await HistoryBidding.find({});
      const historyBiddingImport = listHistoryBidding
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MM YYYY");
          return timeSend.isBetween(startDate, endDate);
        })
        .reduce((acc, cur) => [...acc, ...cur.data], [])
        .reduce((acc, cur) => {
          const exist = acc.find((a) => a.code === cur.code);
          if (exist) {
            exist.quantity += cur.quantity;
          } else {
            acc.push(cur);
          }
          return acc;
        }, []);

      const historyExport = listTicket
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MMM YYYY");
          return (
            timeSend.isBetween(startDate, endDate) &&
            (e.typePlan === 1 || e.typePlan === 2)
          );
        })
        .reduce((acc, cur) => [...acc, ...cur.planList], [])
        .reduce((acc, cur) => {
          const exist = acc.find((a) => a.id === cur.id);
          if (exist) {
            exist.quantity += cur.quantity;
          } else {
            acc.push(cur);
          }
          return acc;
        }, []);
      const historyImport = listTicket
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MMM YYYY");
          return (
            timeSend.isBetween(startDate, endDate) &&
            (e.typePlan === 3 || e.typePlan === 4)
          );
        })
        .reduce((acc, cur) => [...acc, ...cur.planList], [])
        .reduce((acc, cur) => {
          const exist = acc.find((a) => a.id === cur.id);
          if (exist) {
            exist.quantity += cur.quantity;
          } else {
            acc.push(cur);
          }
          return acc;
        }, []);

      const listSupply = await Store.find({});

      const historyExportDetail = historyExport.map((e) => {
        const findSupplyStore = listSupply.find((d) => d._id === e.id);
        if (!findSupplyStore) {
          return {};
        }
        const { _id, yearBidding, __v, codeBidding, ...rest } =
          findSupplyStore._doc;
        return { ...rest, id: e.id, quantityExpect: e.quantity };
      });

      const historyImportDetail = historyImport.map((e) => {
        const findSupplyStore = listSupply.find((d) => d._id === e.id);
        if (!findSupplyStore) {
          return {};
        }
        const { _id, yearBidding, __v, codeBidding, ...rest } =
          findSupplyStore._doc;
        return { ...rest, id: e.id, quantityExpect: e.quantity };
      });

      const mappingExport = historyExportDetail.map((e) => ({
        ...e,
        quantityExport: e.quantityExpect,
        quantityImport: 0,
      }));

      historyImportDetail.forEach((e) => {
        const exist = mappingExport.find((x) => x.id === e.id);
        if (exist) {
          exist.quantityImport = exist.quantityImport + e.quantityExpect;
        } else {
          mappingExport.push({
            ...e,
            quantityImport: e.quantityExpect,
          });
        }
      });

      historyBiddingImport.forEach((e) => {
        const exist = mappingExport.find((x) => x.code === e.code);
        if (exist) {
          exist.quantityImport = exist.quantityImport + e.quantity;
        } else {
          mappingExport.push({
            ...e,
            quantityImport: e.quantity,
            quantityExport: 0,
          });
        }
      });
      const historyInventoryFilterByGroup = mappingExport.filter((e) =>
        group.includes(e.group._id || e.group)
      );
      return res.status(HTTPStatusCode.OK).json(historyInventoryFilterByGroup);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getReportBidding: async (req, res) => {
    const { timeRange, group } = req.body;
    try {
      const startDate = moment(timeRange[0], "DD MM YY");
      const endDate = moment(timeRange[1], "DD MM YY");
      const listBidding = await HistoryBidding.find({});
      const listBiddingFilterTime = listBidding
        .filter((e) => {
          const timeSend = moment(e.createdTime, "DD MM YYYY");
          return timeSend.isBetween(startDate, endDate);
        })
        .reduce((acc, cur) => [...acc, ...cur.data], [])
        .reduce((acc, cur) => {
          const exist = acc.find((a) => a.code === cur.code);
          if (exist) {
            exist.quantity += cur.quantity;
            exist.totalPrice += cur.totalPrice;
          } else {
            acc.push(cur);
          }
          return acc;
        }, [])
        .filter((e) => group.includes(e.group));
      return res.status(HTTPStatusCode.OK).json(listBiddingFilterTime);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = reportController;
