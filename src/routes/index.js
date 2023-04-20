const express = require("express");
const apiV1 = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const departmentRoute = require("./departmentRoute");

apiV1.use("/auth", authRoute);
apiV1.use("/user", userRoute);
apiV1.use("/department", departmentRoute);

module.exports = apiV1;
