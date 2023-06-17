const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const biddingSchema = new mongoose.Schema({
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
    type: Number,
    required: true,
    ref: "Unit",
  },
  group: {
    type: Number,
    required: true,
    ref: "Group",
  },
  isLoss: {
    type: Boolean,
    required: true,
    default: false,
  },
  brand: {
    type: String,
    required: true,
  },
  company: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  yearBidding: {
    type: Number,
    required: true,
  },
  codeBidding: {
    type: String,
    required: true,
  },
  biddingCount: {
    type: Number,
    required: true,
  },
  buyCount: {
    type: Number,
    required: true,
  },
  remainCount: {
    type: Number,
    required: true,
  },
  biddingPrice: {
    type: String,
    required: true,
  },
  contract: {
    type: String,
    required: true,
  },
});

autoIncrement.initialize(mongoose.connection);
biddingSchema.plugin(toJSON);

biddingSchema.plugin(autoIncrement.plugin, "Bidding", {
  model: "Bidding",
  field: "_id",
  startAt: 1,
});

const Bidding = mongoose.model("Bidding", biddingSchema);

module.exports = Bidding;
