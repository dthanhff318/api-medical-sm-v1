var jwt = require("jsonwebtoken");
require("dotenv").config();

const genAccessToken = (data) => {
  return jwt.sign({ data }, process.env.ACCESSTOKEN_KEY, {
    expiresIn: "10m",
  });
};

const genRefreshToken = (data) => {
  return jwt.sign({ data }, process.env.REFRESHTOKEN_KEY, {
    expiresIn: "10h",
  });
};

const decodeToken = async (token, isAccess = true) => {
  return jwt.verify(
    token,
    isAccess ? process.env.ACCESSTOKEN_KEY : process.env.REFRESHTOKEN_KEY
  );
};

module.exports = {
  genAccessToken,
  genRefreshToken,
  decodeToken,
};
