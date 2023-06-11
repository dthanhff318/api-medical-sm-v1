var jwt = require("jsonwebtoken");
require("dotenv").config();

const genAccessToken = (data) => {
  console.log(process.env.ACCESSTOKEN_KEY);
  return jwt.sign({ data }, process.env.ACCESSTOKEN_KEY, {
    expiresIn: "10s",
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
