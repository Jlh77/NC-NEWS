const model = require("../models");

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
