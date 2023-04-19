const express = require("express");
const apiV1 = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");

apiV1.use("/auth", authRoute);
apiV1.use("/user", userRoute);

module.exports = apiV1;
