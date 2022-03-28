const express = require("express");
const app = express();
const controller = require("./controllers/api.controller");

app.use(express.json());

app.get("/api/topics", controller.getTopics);
app.get("/api/articles/:article_id", controller.getArticlesById);

// Error Handlers

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(errorHandlers.customError);
app.use(errorHandlers.psql);
app.use(errorHandlers.unknownGenericError);

module.exports = app;
