const controller = require("../controllers/");

const apiRouter = require("express").Router();

const endpoints = require("../endpoints.json");
apiRouter.get("/", (req, res) => res.json({ endpoints }));

const articlesRouter = require("./articles.router");
apiRouter.use("/articles", articlesRouter);

const commentsRouter = require("./comments.router");
apiRouter.use("/comments", commentsRouter);

const topicsRouter = require("./topics.router");
apiRouter.use("/topics", topicsRouter);

const usersRouter = require("./users.router");
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
