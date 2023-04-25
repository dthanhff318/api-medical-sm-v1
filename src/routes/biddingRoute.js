const express = require("express");
const biddingController = require("../controllers/biddingController");
const biddingRoute = express.Router();

biddingRoute.post("/update", biddingController.updateBiddingList);

module.exports = biddingRoute;
