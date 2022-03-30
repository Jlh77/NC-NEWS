const express = require("express");
const app = express();
const controller = require("./controllers/");
const errorHandlers = require("./errorHandlers");

app.use(express.json());

const endpoints = require("./endpoints.json");
app.get("/api", (req, res) => res.json({ endpoints }));

app.get("/api/articles", controller.articles.getArticles);
app.get("/api/articles/:article_id", controller.articles.getArticleById);
app.patch("/api/articles/:article_id", controller.articles.patchArticleById);
app.get(
  "/api/articles/:article_id/comments",
  controller.articles.getArticleCommentsById
);
app.post(
  "/api/articles/:article_id/comments",
  controller.articles.postArticleCommentById
);

app.delete("/api/comments/:comment_id", controller.comments.removeCommentById);

app.get("/api/topics", controller.topics.getTopics);

app.get("/api/users", controller.users.getUsers);

// Error Handlers

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(errorHandlers.customError);
app.use(errorHandlers.psql);
app.use(errorHandlers.unknownGenericError);

module.exports = app;
