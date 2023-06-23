const Bidding = require("../models/bidding.model");
const Store = require("../models/store.model");
const Group = require("../models/group.model");
const { HTTPStatusCode } = require("../constants");
const Supplier = require("../models/supplier.model");
const Unit = require("../models/unit.model");
const { pickQuery } = require("../utilities/func");

const biddingController = {
  updateBiddingList: async (req, res) => {
    try {
      const dataBidding = req.body.bidding;
      const listSupplier = new Set(dataBidding.map((e) => e.company));
      const listGroup = new Set(dataBidding.map((e) => e.group));
      const listUnit = new Set(dataBidding.map((e) => e.unit));
      // Check and create supplier
      for (const item of listSupplier) {
        const checkExist = await Supplier.findOne({ name: item });
        if (!checkExist) {
          const newSupplier = new Supplier({ name: item });
          await newSupplier.save();
        }
      }
      // Check and create group of supply
      for (const item of listGroup) {
        const checkExist = await Group.findOne({ name: item });
        if (!checkExist) {
          const newGroup = new Group({ name: item });
          await newGroup.save();
        }
      }
      // Check and create Unit of supply
      for (const item of listUnit) {
        const checkExist = await Unit.findOne({ name: item });
        if (!checkExist) {
          const newUnit = new Unit({ name: item });
          await newUnit.save();
        }
      }
      // Create list bidding
      for (const item of dataBidding) {
        const supplierId = await Supplier.findOne({ name: item.company });
        const groupId = await Group.findOne({ name: item.group });
        const unitId = await Unit.findOne({ name: item.unit });
        const biddingItem = new Bidding({
          ...item,
          company: supplierId,
          group: groupId,
          unit: unitId,
        });
        await biddingItem.save();
      }
      return res.status(HTTPStatusCode.OK).json();
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getBidding: async (req, res) => {
    try {
      const { q = "", page = 1, limit = 10, ...moreQuery } = req.query;
      const objQuery = pickQuery(moreQuery);
      const calculatePage = (page - 1) * limit;
      const biddingData = await Bidding.find({
        name: { $regex: q, $options: "i" },
        ...objQuery,
      })
        .skip(calculatePage)
        .limit(Number(limit))
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
      const totalResults = await Bidding.countDocuments({
        name: { $regex: q, $options: "i" },
        ...objQuery,
      });
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
  deleteBidding: async (req, res) => {
    try {
      const supllyId = req.params.id;
      // Check allow delete
      const supplyFind = await Bidding.findById(supllyId);
      const checkExistStore = await Store.findOne({
        code: supplyFind.code,
      });
      if (checkExistStore) {
        return res
          .status(HTTPStatusCode.BAD_REQUEST)
          .json("Supply being used, can't delete");
      }
      const supplyDel = await Bidding.findByIdAndDelete(supllyId);
      return res.status(HTTPStatusCode.OK).json(supplyDel);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getBiddingWithSupplier: async (req, res) => {
    try {
      const idSupplier = req.params.id;
      const findList = await Bidding.find({
        company: idSupplier,
      });
      return res.status(HTTPStatusCode.OK).json(findList);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = biddingController;
