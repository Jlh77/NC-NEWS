const { usersModel } = require("../models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await usersModel.selectAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};
