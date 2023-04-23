const {
  genAccessToken,
  genRefreshToken,
  decodeToken,
} = require("../utilities/tokenHelper");
const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const { HTTPStatusCode } = require("../constants");

const authControllers = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const findUser = await User.findOne({ username });
      if (!findUser) {
        return res
          .status(HTTPStatusCode.BAD_REQUEST)
          .json("Tai khoan khong ton tai");
      }
      const checkPw = await bcrypt.compare(password, findUser.password);
      if (!checkPw) {
        return res.status(HTTPStatusCode.BAD_REQUEST).json("Mat khau sai");
      }
      return res.status(200).json("okay");
    } catch (err) {
      console.log(err);
    }
  },
  // register
  register: async (req, res) => {
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
  // refresh token
  refreshToken: async (req, res) => {
    try {
      const refreshTk = req.body.refresh;
      const decodeTokenValue = await decodeToken(refreshTk, false);
      const accessToken = genAccessToken(decodeTokenValue.uid);
      const refreshToken = genRefreshToken(decodeTokenValue.uid);
      return res.status(HTTPStatusCode.OK).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = authControllers;
