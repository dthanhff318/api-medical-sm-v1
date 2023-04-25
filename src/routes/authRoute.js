const express = require("express");
const { verifyToken } = require("../middlewares/index");
const authControllers = require("../controllers/authController");
const authRoute = express.Router();

authRoute.post("/login", authControllers.login);
authRoute.post("/register", authControllers.register);
authRoute.post("/check-auth", authControllers.checkAuth);
authRoute.post("/refresh", authControllers.refreshToken);

module.exports = authRoute;
