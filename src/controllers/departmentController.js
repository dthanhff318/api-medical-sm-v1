const Department = require("../models/department.model");
const StoreDepart = require("../models/storeDepart.model");
const User = require("../models/users.model");
const { pickQuery } = require("../utilities/func");
const { HTTPStatusCode } = require("../constants");

const departmentController = {
  createDepartment: async (req, res) => {
    try {
      const newDepartment = new Department(req.body);
      const departmentCreated = await newDepartment.save();
      const createdStore = new StoreDepart({
        department: departmentCreated.id,
        data: [],
      });
      await createdStore.save();
      return res.status(HTTPStatusCode.OK).json(departmentCreated);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  updateDepartment: async (req, res) => {
    const { departmentId } = req.params;
    const dataUpdate = pickQuery(req.body);
    const updateDepartment = await Department.findByIdAndUpdate(
      departmentId,
      dataUpdate,
      {
        new: true,
      }
    );
    return res.status(HTTPStatusCode.OK).json(updateDepartment);
  },
  // With pagination
  getDepartments: async (req, res) => {
    try {
      const { q = "", page = 1, limit = 10 } = req.query;
      const calculatePage = (page - 1) * limit;
      const departments = await Department.find({
        name: { $regex: q, $options: "i" },
      })
        .skip(calculatePage)
        .limit(Number(limit))
        .populate({
          path: "owner",
          model: "User",
          select: "displayName",
        });
      const totalResults = await Department.countDocuments({});
      const totalPages = Math.ceil(totalResults / limit);
      return res.status(HTTPStatusCode.OK).json({
        results: departments,
        pagination: {
          totalResults,
          totalPages,
          limit: Number(limit),
          page: Number(page),
        },
      });
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  // Get all with disabled pagination
  getAllDepartment: async (req, res) => {
    try {
      const departments = await Department.find();
      return res.status(HTTPStatusCode.OK).json(departments);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  // Get detail department
  getDetailDepartment: async (req, res) => {
    try {
      const { idDepartment } = req.params;
      const department = await Department.findById(idDepartment).populate({
        path: "member",
        model: "User",
        select: "displayName id",
      });
      return res.status(HTTPStatusCode.OK).json(department);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const { departmentId } = req.params;
      const delDepart = await Department.findByIdAndDelete(departmentId, {
        returnOriginal: true,
      });
      // Delete all user in this department
      await User.deleteMany({
        _id: { $in: delDepart.member },
      });
      return res.status(HTTPStatusCode.OK).json(delDepart);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = departmentController;
