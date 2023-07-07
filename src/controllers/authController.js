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
      const dataUser = {
        id: findUser.id,
        displayName: findUser.displayName,
        role: findUser.role,
        department: findUser.department,
        email: findUser.email,
        photo: findUser.photo,
      };
      const accessToken = genAccessToken(dataUser);
      const refreshToken = genRefreshToken(dataUser);
      return res.status(200).json({ ...dataUser, accessToken, refreshToken });
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
        role: req.body.role,
        password: hashedPassword,
      });
      const user = await newUser.save();
      return res.status(HTTPStatusCode.OK).json(user);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.OK).json(err);
    }
  },
  // Get auth
  checkAuth: async (req, res) => {
    try {
      const rawData = await decodeToken(req.body.refreshToken, false);
      return res.status(HTTPStatusCode.OK).json(rawData.data);
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
      const accessToken = genAccessToken(decodeTokenValue.data);
      const refreshToken = genRefreshToken(decodeTokenValue.data);
      return res.status(HTTPStatusCode.OK).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const idUser = req.infoUser.data.id;
      const user = await User.findById(idUser);
      const { username, password, __v, _id, ...userInfo } = user._doc;
      userInfo.id = Number(idUser);
      return res.status(HTTPStatusCode.OK).json(userInfo);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = authControllers;
