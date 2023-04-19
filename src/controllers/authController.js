const {
  genAccessToken,
  genRefreshToken,
  decodeToken,
} = require("../utilities/tokenHelper");
const User = require("../models/users.model");
const { HTTPStatusCode } = require("../constants");

const authControllers = {
  login: async (req, res) => {
    // const { uid } = req.body;
    // const findUser = await User.findOne({ uid });
    // console.log(findUser);
    // const accessToken = genAccessToken(uid);
    // const refreshToken = genRefreshToken(uid);
    // if (findUser) {
    //   return res
    //     .status(HTTPStatusCode.OK)
    //     .json({ ...findUser._doc, accessToken, refreshToken });
    // } else {
    //   const newUser = new User(req.body);
    //   const newFriends = new Friend({ uid });
    //   await newFriends.save();
    //   const infoNewUser = await newUser.save();
    //   return res
    //     .status(HTTPStatusCode.OK)
    //     .json({ ...infoNewUser._doc, accessToken, refreshToken });
    // }
    return res.status(200).json("hiohhi");
  },
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
