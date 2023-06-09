const { HTTPStatusCode } = require("../constants");
const moment = require("moment");
const StoreDepart = require("../models/storeDepart.model");
const Store = require("../models/store.model");
const Bidding = require("../models/bidding.model");
const { pickQuery } = require("../utilities/func");
const HistoryBidding = require("../models/historyBidding.model");

const storeController = {
  getSupplyFromStore: async (req, res) => {
    try {
      const { q = "", page = 1, limit = 10, ...moreQuery } = req.query;
      const objQuery = pickQuery(moreQuery);
      const calculatePage = (page - 1) * limit;
      const storeSupply = await Store.find({
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
      const totalResults = await Store.countDocuments({
        name: { $regex: q, $options: "i" },
        ...objQuery,
      });
      const totalPages = Math.ceil(totalResults / limit);
      return res.status(HTTPStatusCode.OK).json({
        results: storeSupply,
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
  addSupplyToStore: async (req, res) => {
    try {
      const { company, codeBill, add } = req.body;
      for (const supply of add) {
        const { price, totalPrice, unitPrice, ...data } = supply;
        const findSupplyExist = await Store.findOne({ code: data.code });
        const findBiddingSupply = await Bidding.findOne({ code: data.code });
        if (!findBiddingSupply) {
          return res
            .status(HTTPStatusCode.BAD_REQUEST)
            .json("Some supplies not includes in bidding list");
        }
        if (!findSupplyExist) {
          const storeItem = new Store({ ...data, company });
          await storeItem.save();
        } else {
          if (findBiddingSupply.quantity < findSupplyExist.quantity) {
            return res
              .status(HTTPStatusCode.BAD_REQUEST)
              .json(
                "The quantity of some supplies is greater than its in bidding list"
              );
          }
          await Store.findOneAndUpdate(
            { code: data.code },
            {
              $inc: { quantity: data.quantity },
            }
          );
          await Bidding.findOneAndUpdate(
            {
              code: data.code,
            },
            {
              $inc: {
                remainCount: -Number(data.quantity),
                buyCount: data.quantity,
              },
            }
          );
        }
      }
      const historyBiddingExport = new HistoryBidding({
        data: add,
        type: "import",
        createdTime: moment(new Date().now).format("DD-MM-YYYY"),
        codeBill,
      });
      await historyBiddingExport.save();
      return res.status(HTTPStatusCode.OK).json("OK");
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  updateSupply: async (req, res) => {
    try {
      const { id } = req.params;
      const dataUpdate = req.body;
      const supplyUpdated = await Store.findByIdAndUpdate(id, dataUpdate, {
        new: true,
      })
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
      if (!supplyUpdated) {
        return res.status(HTTPStatusCode.NOT_FOUND).json("Not found supply");
      }
      return res.status(HTTPStatusCode.OK).json(supplyUpdated);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  deleteOneSupply: async (req, res) => {
    try {
      const { id } = req.params;
      const listStoreDepart = await StoreDepart.find({});
      const totalStoreDepart = listStoreDepart.reduce((acc, cur) => {
        return [...acc, ...cur.data];
      }, []);
      const checkExistInStoreDepart = totalStoreDepart.find(
        (e) => e.supply === Number(id)
      );
      if (checkExistInStoreDepart) {
        return res
          .status(HTTPStatusCode.BAD_REQUEST)
          .json("Supply being used in some department, can't delete");
      }
      const supplyDeleted = await Store.findByIdAndDelete(id);
      if (!supplyDeleted) {
        return res.status(HTTPStatusCode.NOT_FOUND).json("Not found supply");
      }

      return res.status(HTTPStatusCode.OK).json();
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  // Department
  getSupplyOfDepartment: async (req, res) => {
    try {
      const { q = "", page = 1, limit = 10 } = req.query;
      const { id } = req.params;
      const calculatePage = (page - 1) * limit;
      const storeDepartment = await StoreDepart.findOne({
        department: id,
      }).populate({
        path: "data.supply",
        model: "Store",
        select: "-quantity",
        populate: [
          {
            path: "company",
            model: "Supplier",
          },
          { path: "unit", model: "Unit" },
          { path: "group", model: "Group" },
        ],
      });

      const mappingData = storeDepartment.data
        .map((d) => {
          if (!d.supply._id) {
            return {};
          }
          const id = d.supply._id;
          delete d.supply._doc._id;
          return {
            ...d.supply._doc,
            quantity: d.quantity,
            id,
          };
        })
        .slice(calculatePage, calculatePage + limit); //Paging

      const totalResults = mappingData.length;
      const totalPages = Math.ceil(totalResults / limit);
      return res.status(HTTPStatusCode.OK).json({
        results: mappingData,
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
};

module.exports = storeController;
