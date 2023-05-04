const express = require("express");
const biddingController = require("../controllers/biddingController");
const biddingRoute = express.Router();

biddingRoute.get("/", biddingController.getBidding);
biddingRoute.get("/supplier/:id", biddingController.getBiddingWithSupplier);
biddingRoute.post("/", biddingController.updateBiddingList);
biddingRoute.delete("/:id", biddingController.deleteBidding);

module.exports = biddingRoute;
