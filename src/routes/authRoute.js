const express = require("express");
const authControllers = require("../controllers/authController");
const authRoute = express.Router();

authRoute.post("/login", authControllers.login);
authRoute.post("/refresh", authControllers.refreshToken);

module.exports = authRoute;
