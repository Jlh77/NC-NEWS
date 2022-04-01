const { usersModel } = require("../models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await usersModel.selectAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await usersModel.selectUserById(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
