const { HTTPStatusCode } = require("../constants");
const Noti = require("../models/noti.model");

const notiController = {
  getNoti: async (req, res) => {
    const { notiFor } = req.query;
    const listNoti = await Noti.find({ notiFor });
    return res.status(HTTPStatusCode.OK).json(listNoti);
  },
  markAsSeenNoti: async (req, res) => {
    const { listNoti } = req.body;
    for (const id of listNoti) {
      await Noti.findByIdAndUpdate(id, {
        seen: true,
      });
    }
    return res.status(HTTPStatusCode.OK).json();
  },
};

module.exports = notiController;
