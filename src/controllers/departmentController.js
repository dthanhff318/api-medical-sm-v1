const Department = require("../models/department.model");
const { HTTPStatusCode } = require("../constants");

const departmentController = {
  createDepartment: async (req, res) => {
    try {
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
      });
      const user = await newUser.save();
      return res.status(HTTPStatusCode.OK).json(user);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.OK).json(err);
    }
  },
  getDepartments: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const calculatePage = (page - 1) * limit;
    const departments = await Department.find()
      .skip(calculatePage)
      .limit(limit);
    return res.status(HTTPStatusCode.OK).json(departments);
  },
  deleteDepartment: async (req, res) => {
    const { departmentId } = req.params;
    const delDepart = await Department.findByIdAndDelete(departmentId, {
      returnOriginal: true,
    });
    return res.status(HTTPStatusCode.OK).json(delDepart);
  },
};

module.exports = departmentController;
