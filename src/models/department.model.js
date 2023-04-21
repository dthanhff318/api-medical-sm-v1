const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    default: null,
  },
  member: {
    type: [Number],
    default: [],
    ref: "User",
  },
  phone: {
    type: String,
    required: true,
  },
  owner: {
    type: Number,
    ref: "User",
    default: null,
  },
});

autoIncrement.initialize(mongoose.connection);
departmentSchema.plugin(toJSON);

departmentSchema.plugin(autoIncrement.plugin, "Department", {
  model: "Department",
  field: "_id",
  startAt: 1,
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
