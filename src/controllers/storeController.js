const { HTTPStatusCode } = require("../constants");
const Store = require("../models/store.model");

const storeController = {
  getSupplyFromStore: async (req, res) => {
    try {
      const { q = "", page = 1, limit = 10 } = req.query;
      const calculatePage = (page - 1) * limit;
      const storeSupply = await Store.find({
        name: { $regex: q, $options: "i" },
      })
        .skip(calculatePage)
        .limit(Number(limit))
        .populate({
          path: "company",
          model: "Supplier",
          select: "name",
        });
      const totalResults = await Store.countDocuments({});
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
      console.log(add);
      for (const supply of add) {
        const { price, totalPrice, unitPrice, ...data } = supply;
        const storeItem = new Store({ ...data, company });
        await storeItem.save();
      }
      return res.status(HTTPStatusCode.OK).json("OK");
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  deleteOneSupply: async (req, res) => {
    try {
      const { id } = req.params;
      await Store.findByIdAndDelete(id);
      return res.status(HTTPStatusCode.OK).json();
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = storeController;
