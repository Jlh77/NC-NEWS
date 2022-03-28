const express = require("express");
const app = express();
const controller = require("./controllers/api.controller");

app.use(express.json());

app.get("/api/topics", controller.getTopics);

// Error Handlers
app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
