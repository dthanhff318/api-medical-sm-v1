const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

autoIncrement.initialize(mongoose.connection);

const notiSchema = new mongoose.Schema({
  notiFor: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
  department: {
    type: Number,
    ref: "Department",
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "accept", "reject"],
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
  ticket: {
    type: Number,
    ref: "Plan",
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});
notiSchema.plugin(toJSON);
notiSchema.plugin(autoIncrement.plugin, "Noti", {
  model: "Noti",
  field: "_id",
  startAt: 1,
});

const Noti = mongoose.model("Noti", notiSchema);

module.exports = Noti;
