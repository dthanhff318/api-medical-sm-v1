const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
});

autoIncrement.initialize(mongoose.connection);
supplierSchema.plugin(toJSON);

supplierSchema.plugin(autoIncrement.plugin, "Supplier", {
  model: "Supplier",
  field: "_id",
  startAt: 1,
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
