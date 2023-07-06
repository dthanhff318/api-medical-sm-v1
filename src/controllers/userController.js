const bcrypt = require("bcrypt");
const User = require("../models/users.model");
const Department = require("../models/department.model");
const { HTTPStatusCode } = require("../constants");
const { sendUserRegistrationInfo } = require("../services/email.services");

const userController = {
  createStaff: async (req, res) => {
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
      await sendUserRegistrationInfo(req.body);
      return res.status(HTTPStatusCode.OK).json(user);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  createUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const idDepartment = req.body.department;
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
      await Department.findByIdAndUpdate(idDepartment, {
        $push: { member: user.id },
      });
      await sendUserRegistrationInfo(req.body);
      return res.status(HTTPStatusCode.OK).json(user);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.OK).json(err);
    }
  },
  getUsers: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const calculatePage = (page - 1) * limit;
    const users = await User.find().skip(calculatePage).limit(Number(limit));
    return res.status(HTTPStatusCode.OK).json(users);
  },
  deleteUser: async (req, res) => {
    const { userId } = req.params;
    const delUser = await User.findByIdAndDelete(userId, {
      returnOriginal: true,
    });
    if (delUser.department) {
      await Department.updateOne(
        { _id: delUser.department },
        {
          $pull: { member: delUser.id },
        }
      );
    }
    return res.status(HTTPStatusCode.OK).json(delUser);
  },
  getStaffList: async (req, res) => {
    try {
      const { q = "" } = req.query;
      const listStaff = await User.find({
        role: { $in: ["staff-accept", "staff-report"] },
        displayName: { $regex: q, $options: "i" },
      });
      return res.status(HTTPStatusCode.OK).json(listStaff);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },

  getStaffByDepartment: async (req, res) => {
    try {
      const { department } = req.body;
      const findDepartment = await Department.findById(department).populate({
        path: "member",
        modal: "User",
      });
      return res.status(HTTPStatusCode.OK).json(findDepartment);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = userController;
