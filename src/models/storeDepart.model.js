const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const storeDepartSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    // Mixed : { supply : number , quantity : number}
    ref: "Store",
    required: true,
    default: [],
  },
});

autoIncrement.initialize(mongoose.connection);
storeDepartSchema.plugin(toJSON);

storeDepartSchema.plugin(autoIncrement.plugin, "StoreDepart", {
  model: "StoreDepart",
  field: "_id",
  startAt: 1,
});

const StoreDepart = mongoose.model("StoreDepart", storeDepartSchema);

module.exports = StoreDepart;
