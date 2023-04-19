const express = require("express");
const departmentController = require("../controllers/departmentController");
const departmentRoute = express.Router();

departmentRoute.get("/", departmentController.getDepartments);
departmentRoute.post("/", departmentController.createDepartment);
departmentRoute.delete("/:departmentId", departmentController.deleteDepartment);

module.exports = departmentRoute;
