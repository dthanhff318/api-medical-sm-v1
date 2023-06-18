const express = require("express");
const apiV1 = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const departmentRoute = require("./departmentRoute");
const biddingRoute = require("./biddingRoute");
const supplierRoute = require("./supplierRoute");
const storeRoute = require("./storeRoute");
const planRoute = require("./planRoute");
const serviceRoute = require("./serviceRoute");
const notiRoute = require("./notiRoute");
const reportRoute = require("./reportRoute");
const unitRoute = require("./unitRoute");
const groupRoute = require("./groupRoute");

apiV1.use("/auth", authRoute);
apiV1.use("/user", userRoute);
apiV1.use("/department", departmentRoute);
apiV1.use("/bidding", biddingRoute);
apiV1.use("/supplier", supplierRoute);
apiV1.use("/store", storeRoute);
apiV1.use("/plan", planRoute);
apiV1.use("/service", serviceRoute);
apiV1.use("/noti", notiRoute);
apiV1.use("/report", reportRoute);
apiV1.use("/unit", unitRoute);
apiV1.use("/group", groupRoute);

module.exports = apiV1;
