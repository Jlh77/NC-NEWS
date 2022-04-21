const controller = require("../controllers");
const topicsRouter = require("express").Router();

topicsRouter
  .route("/")
  .get(controller.topics.getTopics)
  .post(controller.topics.postTopic);

module.exports = topicsRouter;
