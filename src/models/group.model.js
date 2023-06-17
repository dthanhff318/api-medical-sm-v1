const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

autoIncrement.initialize(mongoose.connection);
groupSchema.plugin(toJSON);

groupSchema.plugin(autoIncrement.plugin, "Group", {
  model: "Group",
  field: "_id",
  startAt: 1,
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
