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
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: String,
    required: true,
  },
  yearBidding: {
    type: String,
    required: true,
  },
  codeBidding: {
    type: String,
    required: true,
  },
  biddingCount: {
    type: String,
    required: true,
  },
  buyCount: {
    type: String,
    required: true,
  },
  remainCount: {
    type: String,
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
