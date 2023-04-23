const express = require("express");
const authControllers = require("../controllers/authController");
const biddingRoute = express.Router();

biddingRoute.post("/update", authControllers.login);
biddingRoute.post("/refresh", authControllers.refreshToken);

module.exports = biddingRoute;
