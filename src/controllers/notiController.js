const { HTTPStatusCode } = require("../constants");
const Noti = require("../models/noti.model");

const notiController = {
  getNoti: async (req, res) => {
    const { notiFor } = req.query;
    const listNoti = await Noti.find({ notiFor });
    return res.status(HTTPStatusCode.OK).json(listNoti);
  },
};

module.exports = notiController;
