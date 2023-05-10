const { HTTPStatusCode } = require("../constants");
const Store = require("../models/store.model");

const storeController = {
  getSupplyFromStore: async (req, res) => {
    try {
      const { q = "" } = req.query;
      const { page = 1, limit = 10 } = req.query;
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
      return res.status(HTTPStatusCode.OK).json(storeSupply);
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
};

module.exports = storeController;
