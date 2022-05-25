const { authModel } = require("../models");

exports.logout = async (req, res, next) => {
  try {
    req.logout();
    res.status(200).send({ msg: "You are now logged out." });
  } catch (err) {
    next(err);
  }
};

exports.logoutAllDevices = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      await authModel.logoutAllDevices();
      req.logout();
      res.status(200).send({ msg: "You have been logged out on all devices." });
    } else {
      res.status(400).send({
        msg: "You are were not logged in when you tried to logout of all devices. Please login to try again.",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.handleOAuthGoogleRedirect = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.handleUnlinkGoogle = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.getUserData = async (req, res, next) => {
  try {
    if (!req.user) {
      res.send(null);
    } else {
      req.user.password = undefined;
      req.user.salt = undefined;
      res.send(req.user);
    }
  } catch (err) {
    next(err);
  }
};

exports.logout;
