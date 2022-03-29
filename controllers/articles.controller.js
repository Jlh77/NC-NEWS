const model = require("../models");

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await model.selectAllArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await model.selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const updatedArticle = await model.updateArticleById(article_id, inc_votes);
    res.status(200).send({ updatedArticle });
  } catch (err) {
    next(err);
  }
};

exports.getArticleCommentsById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await model.selectArticleCommentsById(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
exports.postArticleCommentById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { username, body } = req.body;
    const [postedComment] = await Promise.all([
      model.insertArticleCommentById(article_id, username, body),
      model.selectArticleById(article_id),
    ]);
    res.status(200).send({ postedComment });
  } catch (err) {
    next(err);
  }
};
