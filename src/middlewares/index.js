const { HTTPStatusCode } = require("../constants");
const { decodeToken } = require("../utilities/tokenHelper");

const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const infoUser = await decodeToken(accessToken);
    req.infoUser = infoUser;
    next();
  } catch (err) {
    return res.status(HTTPStatusCode.UNAUTHORIZED).json("Unauthorized");
  }
};

module.exports = {
  verifyToken,
};
