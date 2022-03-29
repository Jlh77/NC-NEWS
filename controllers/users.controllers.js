const model = require("../models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await model.selectAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};
