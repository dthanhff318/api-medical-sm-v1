const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");
const { required } = require("joi");

const planSchema = new mongoose.Schema({
  department: {
    type: Number,
    required: true,
    ref: "Department",
  },
  typePlan: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  planList: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    ref: "Bidding",
  },
  createdTime: {
    type: String,
    required: true,
  },
});

autoIncrement.initialize(mongoose.connection);
planSchema.plugin(toJSON);

planSchema.plugin(autoIncrement.plugin, "Plan", {
  model: "Plan",
  field: "_id",
  startAt: 1,
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
