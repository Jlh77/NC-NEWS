const controller = require("../controllers/");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/")
  .get(controller.articles.getArticles)
  .post(controller.articles.postArticle);

articlesRouter
  .route("/:article_id")
  .get(controller.articles.getArticleById)
  .patch(controller.articles.patchArticleById)
  .delete(controller.articles.removeArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(controller.articles.getArticleCommentsById)
  .post(controller.articles.postArticleCommentById);

module.exports = articlesRouter;
