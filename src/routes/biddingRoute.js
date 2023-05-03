const express = require("express");
const biddingController = require("../controllers/biddingController");
const biddingRoute = express.Router();

biddingRoute.get("/", biddingController.getBidding);
biddingRoute.get("/search", biddingController.findBidding);
biddingRoute.post("/", biddingController.updateBiddingList);
biddingRoute.delete("/:id", biddingController.deleteBidding);

module.exports = biddingRoute;
