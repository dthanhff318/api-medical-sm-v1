const Bidding = require("../models/bidding.model");
const { HTTPStatusCode } = require("../constants");
const Supplier = require("../models/supplier.model");

const biddingController = {
  updateBiddingList: async (req, res) => {
    try {
      const dataBidding = req.body.bidding;
      const listSupplier = new Set(dataBidding.map((e) => e.company));
      // Check and create supplier
      for (const item of listSupplier) {
        const checkExist = await Supplier.findOne({ name: item });
        if (!checkExist) {
          const newSupplier = new Supplier({ name: item });
          await newSupplier.save();
        }
      }
      // Create list bidding
      for (const item of dataBidding) {
        const supplierId = await Supplier.findOne({ name: item.company });
        const biddingItem = new Bidding({ ...item, company: supplierId });
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
      const biddingData = await Bidding.find({}).populate({
        path: "company",
        model: "Supplier",
        select: "name",
      });
      return res.status(HTTPStatusCode.OK).json(biddingData);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  deleteBidding: async (req, res) => {
    try {
      const supllyId = req.params.id;
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
