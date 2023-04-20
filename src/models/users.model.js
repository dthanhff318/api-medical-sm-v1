const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { toJSON } = require("./plugin/toJSON.plugin");

autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    maxlength: 40,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  username: {
    type: String,
    required: true,
    minlength: 6,
  },
  department: {
    type: String,
    default: null,
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
