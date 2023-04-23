const { HTTPStatusCode } = require("../constants");

const biddingController = {
  updateBiddingList: async (req, res) => {
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

module.exports = biddingController;
