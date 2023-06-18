const express = require("express");
const groupController = require("../controllers/groupController");
const groupRoute = express.Router();

groupRoute.get("/", groupController.getGroups);
groupRoute.post("/", groupController.createGroup);
groupRoute.patch("/:id", groupController.updateGroup);
groupRoute.delete("/:id", groupController.deleteGroup);

module.exports = groupRoute;
