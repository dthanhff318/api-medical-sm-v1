const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  ingredient: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  company: {
    type: Number,
    required: true,
    ref: "Supplier",
  },
  country: {
    type: String,
    required: true,
  },
  yearBidding: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  dateExpired: {
    type: String,
    default: "",
  },
  productCode: {
    type: String,
    default: null,
  },
  codeBidding: {
    type: String,
    default: null,
  },
});

autoIncrement.initialize(mongoose.connection);
storeSchema.plugin(toJSON);

storeSchema.plugin(autoIncrement.plugin, "Store", {
  model: "Store",
  field: "_id",
  startAt: 1,
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
