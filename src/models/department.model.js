const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

autoIncrement.initialize(mongoose.connection);

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: null,
  },
  owner: {
    type: [String],
    default: [],
    ref: "User",
  },
  phone: {
    type: String,
    required: true,
  },
});
// departmentSchema.plugin(autoIncrement.plugin, "User");
// departmentSchema.plugin(autoIncrement.plugin, "User", {
//   model: "User",
//   field: "_id",
//   startAt: 1,
// });
departmentSchema.plugin(toJSON);

const User = mongoose.model("Department", departmentSchema);

module.exports = User;
