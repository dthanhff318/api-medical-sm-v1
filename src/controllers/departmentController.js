const Department = require("../models/department.model");
const { HTTPStatusCode } = require("../constants");

const departmentController = {
  createDepartment: async (req, res) => {
    try {
      const newDepartment = new Department(req.body);
      const departmentCreated = await newDepartment.save();
      return res.status(HTTPStatusCode.OK).json(departmentCreated);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  // With pagination
  getDepartments: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const calculatePage = (page - 1) * limit;
      const departments = await Department.find()
        .skip(calculatePage)
        .limit(Number(limit))
        .populate({
          path: "owner",
          model: "User",
          select: "displayName",
        });
      return res.status(HTTPStatusCode.OK).json(departments);
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
      return res.status(HTTPStatusCode.OK).json(delDepart);
    } catch (err) {
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = departmentController;
