const { HTTPStatusCode } = require("../constants");
const Noti = require("../models/noti.model");

const notiController = {
  getNoti: async (req, res) => {
    const { notiFor, offset = 1 } = req.query;
    const calculateOffset = (offset - 1) * 10;
    const listNoti = await Noti.find({ notiFor })
      .skip(calculateOffset)
      .limit(10)
      .populate({
        path: "department",
        model: "Department",
        select: "name",
      })
      .populate({
        path: "ticket",
        model: "Plan",
        select: "typePlan",
      });
    const numberOfUnreadNoti = await Noti.countDocuments({ seen: false });
    const countNoti = await Noti.countDocuments({});
    const hasMore = countNoti > offset * 10;
    return res.status(HTTPStatusCode.OK).json({
      listNoti,
      unread: numberOfUnreadNoti,
      isHasMore: hasMore,
    });
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
