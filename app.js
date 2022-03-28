const express = require("express");
const app = express();
const controller = require("./controllers/api.controller");

app.use(express.json());

app.get("/api/topics", controller.getTopics);

module.exports = app;
