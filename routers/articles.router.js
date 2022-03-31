const controller = require("../controllers/");
const articlesRouter = require("express").Router();

articlesRouter.get("/", controller.articles.getArticles);

articlesRouter
  .route("/:article_id")
  .get(controller.articles.getArticleById)
  .patch(controller.articles.patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(controller.articles.getArticleCommentsById)
  .post(controller.articles.postArticleCommentById);

module.exports = articlesRouter;
