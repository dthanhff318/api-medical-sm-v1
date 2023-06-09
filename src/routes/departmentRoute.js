const express = require("express");
const departmentController = require("../controllers/departmentController");
const { verifyToken } = require("../middlewares/index");
const departmentRoute = express.Router();

departmentRoute.get("/", departmentController.getDepartments);
departmentRoute.get("/all", departmentController.getAllDepartment);
departmentRoute.get("/:idDepartment", departmentController.getDetailDepartment);
departmentRoute.post("/", departmentController.createDepartment);
departmentRoute.patch("/:departmentId", departmentController.updateDepartment);
departmentRoute.delete("/:departmentId", departmentController.deleteDepartment);

module.exports = departmentRoute;
