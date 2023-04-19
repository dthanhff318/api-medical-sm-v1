const bcrypt = require("bcrypt");
const User = require("../models/users.model");
const { HTTPStatusCode } = require("../constants");

const userController = {
  createUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const checkUsername = await User.findOne({ username: req.body.username });
      if (checkUsername) {
        return res
          .status(HTTPStatusCode.INTERNAL_SERVER_ERROR)
          .json("Username already taken");
      }
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
      });
      const user = await newUser.save();
      return res.status(HTTPStatusCode.OK).json(user);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.OK).json(err);
    }
  },
  getUsers: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const calculatePage = (page - 1) * limit;
    const users = await User.find().skip(calculatePage).limit(limit);
    return res.status(HTTPStatusCode.OK).json(users);
  },
  deleteUser: async (req, res) => {
    const { userId } = req.params;
    const delUser = await User.findByIdAndDelete(userId, {
      returnOriginal: true,
    });
    return res.status(HTTPStatusCode.OK).json(delUser);
  },
};

module.exports = userController;
