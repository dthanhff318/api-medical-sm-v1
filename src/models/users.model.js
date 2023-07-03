const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: Number,
    default: undefined,
  },
  role: {
    type: String,
    enum: ["admin", "user", "staff-accept", "staff-report"],
    default: "user",
    required: true,
  },
});
userSchema.plugin(toJSON);
userSchema.plugin(autoIncrement.plugin, "User", {
  model: "User",
  field: "_id",
  startAt: 1,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
