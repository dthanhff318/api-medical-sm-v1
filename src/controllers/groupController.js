const Group = require("../models/group.model");
const { pickQuery } = require("../utilities/func");
const { HTTPStatusCode } = require("../constants");

const groupController = {
  createGroup: async (req, res) => {
    try {
      const checkGroup = await Group.findOne({ name: req.body.name });
      if (checkGroup) {
        return res
          .status(HTTPStatusCode.INTERNAL_SERVER_ERROR)
          .json("Group have been already");
      }
      const newGroup = new Group({
        ...req.body,
      });
      const group = await newGroup.save();
      return res.status(HTTPStatusCode.OK).json(group);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.OK).json(err);
    }
  },
  getGroups: async (req, res) => {
    const { q = "", page = 1, limit = 10 } = req.query;
    const calculatePage = (page - 1) * limit;
    const groups = await Group.find({
      name: { $regex: q, $options: "i" },
    })
      .skip(calculatePage)
      .limit(Number(limit));
    const totalResults = await Group.countDocuments({});
    const totalPages = Math.ceil(totalResults / limit);
    return res.status(HTTPStatusCode.OK).json({
      results: groups,
      pagination: {
        totalResults,
        totalPages,
        limit: Number(limit),
        page: Number(page),
      },
    });
  },
  updateGroup: async (req, res) => {
    const { id } = req.params;
    const dataUpdate = pickQuery(req.body);
    const updateGroup = await Group.findByIdAndUpdate(id, dataUpdate, {
      new: true,
    });
    return res.status(HTTPStatusCode.OK).json(updateGroup);
  },

  deleteGroup: async (req, res) => {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    return res.status(HTTPStatusCode.OK).json();
  },
};

module.exports = groupController;
