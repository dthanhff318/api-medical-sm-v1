const express = require("express");
const apiV1 = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const departmentRoute = require("./departmentRoute");
const biddingRoute = require("./biddingRoute");
const supplierRoute = require("./supplierRoute");

apiV1.use("/auth", authRoute);
apiV1.use("/user", userRoute);
apiV1.use("/department", departmentRoute);
apiV1.use("/bidding", biddingRoute);
apiV1.use("/supplier", supplierRoute);

module.exports = apiV1;
