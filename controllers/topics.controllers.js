const model = require("../models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await model.selectAllTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};
