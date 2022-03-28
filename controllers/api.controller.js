const model = require("../models/api.model");

exports.getTopics = (req, res, next) => {
  return model
    .selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
