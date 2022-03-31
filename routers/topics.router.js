const controller = require("../controllers");
const topicsRouter = require("express").Router();

topicsRouter.get("/", controller.topics.getTopics);

module.exports = topicsRouter;
