const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

autoIncrement.initialize(mongoose.connection);
unitSchema.plugin(toJSON);

unitSchema.plugin(autoIncrement.plugin, "Unit", {
  model: "Unit",
  field: "_id",
  startAt: 1,
  incrementBy: 1,
});

const Unit = mongoose.model("Unit", unitSchema);

module.exports = Unit;
