const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const planSchema = new mongoose.Schema({
  department: {
    type: Number,
    required: true,
    ref: "Department",
  },
  data: {
    type: [Number],
    required: true,
    ref: "Bidding",
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
