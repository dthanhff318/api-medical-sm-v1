const express = require("express");
const userControllers = require("../controllers/userController");
const userRoute = express.Router();

userRoute.get("/", userControllers.getUsers);
userRoute.post("/", userControllers.createUser);
userRoute.delete("/:userId", userControllers.deleteUser);

module.exports = userRoute;
