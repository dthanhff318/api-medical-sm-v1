const express = require("express");
const cors = require("cors");
const createServer = require("http").createServer;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connect = require("./mongoDbConfig/mongoConfig");
const apiV1 = require("./routes");
const Server = require("socket.io").Server;

require("dotenv").config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/v1", apiV1);
connect();

io.on("connection", (socket) => {
  socket.emit("hi", 123);
  socket.on("disconnect", () => {
    // console.log("user disconnected");
    // disconectTimeout = setTimeout(() => {
    //   console.log("User disconect the server");
    // }, 3000);
  });

  socket.on("connect", () => {
    console.log("One user reconnect");
    // clearTimeout(disconectTimeout);
  });
});

httpServer.listen(process.env.PORT, process.env.BASE_URL, async () => {
  console.log("Server is running in Port 4000");
});
