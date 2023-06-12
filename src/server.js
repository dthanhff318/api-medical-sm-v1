const express = require("express");
const cors = require("cors");
const createServer = require("http").createServer;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connect = require("./mongoDbConfig/mongoConfig");
const apiV1 = require("./routes");

require("dotenv").config();
const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/v1", apiV1);
connect();

httpServer.listen(process.env.PORT, process.env.BASE_URL, async () => {
  console.log("Server is running in Port 4000");
});
