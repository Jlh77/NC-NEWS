const { topicsModel } = require("../models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await topicsModel.selectAllTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  try {
    const { slug, description } = req.body;
    const newTopic = await topicsModel.insertTopic(slug, description);
    res.status(200).send({ newTopic });
  } catch (err) {
    next(err);
  }
};
