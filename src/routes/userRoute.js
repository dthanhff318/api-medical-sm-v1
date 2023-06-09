const express = require("express");
const userControllers = require("../controllers/userController");
const userRoute = express.Router();

userRoute.get("/", userControllers.getUsers);
userRoute.post("/", userControllers.createUser);
userRoute.post("/staff", userControllers.createStaff);
userRoute.post("/staff-department", userControllers.getStaffByDepartment);
userRoute.get("/staff", userControllers.getStaffList);
userRoute.delete("/:userId", userControllers.deleteUser);

module.exports = userRoute;
