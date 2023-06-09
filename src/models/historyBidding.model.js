const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const historyBiddingSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
    // Mixed : { supply : number , quantity : number}
    ref: "Store",
    required: true,
    default: [],
  },
  type: {
    type: String,
    enum: ["import", "export"],
    default: "import",
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
  codeBill: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
    default: false,
  },
});

autoIncrement.initialize(mongoose.connection);
historyBiddingSchema.plugin(toJSON);

historyBiddingSchema.plugin(autoIncrement.plugin, "HistoryBidding", {
  model: "HistoryBidding",
  field: "_id",
  startAt: 1,
});

const HistoryBidding = mongoose.model("HistoryBidding", historyBiddingSchema);

module.exports = HistoryBidding;
