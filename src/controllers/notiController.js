const { HTTPStatusCode } = require("../constants");
const Noti = require("../models/noti.model");

const notiController = {
  getNoti: async (req, res) => {
    const { notiFor, offset = 1, department } = req.query;
    const queryObj = Object.entries(req.query).reduce((qrObj, q) => {
      if (q[1]) {
        return { ...qrObj, [q[0]]: q[1] };
      }
    }, {});
    delete queryObj["offset"];
    const calculateOffset = (offset - 1) * 10;
    const listNoti = await Noti.find(queryObj)
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
    const numberOfUnreadNoti = await Noti.countDocuments({
      notiFor,
      seen: false,
    });
    const countNoti = await Noti.countDocuments(queryObj);
    const hasMore = countNoti > offset * 10;
    return res.status(HTTPStatusCode.OK).json({
      listNoti,
      unread: numberOfUnreadNoti,
      isHasMore: hasMore,
    });
  },
  markAsSeenNoti: async (req, res) => {
    const { idNoti } = req.body;
    const findNoti = await Noti.findById(idNoti);
    if (!findNoti) {
      return;
    }
    const updateStatusNoti = await Noti.findByIdAndUpdate(idNoti, {
      seen: true,
      new: true,
    });

    return res.status(HTTPStatusCode.OK).json(updateStatusNoti);
  },
};

module.exports = notiController;
