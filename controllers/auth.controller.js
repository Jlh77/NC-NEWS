const { authModel } = require("../models");
const passport = require("passport");

const isProduction = process.env.NODE_ENV === "production" ? true : false;

exports.login = (req, res, next) => {
  passport.authenticate("local-login", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info);
    else {
      req.logIn(user, (err) => {
        res.send({ message: "Succesfully logged in" });
      });
    }
  })(req, res, next);
};

exports.join = (req, res, next) => {
  passport.authenticate("local-register", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info);
    else {
      req.logIn(user, (err) => {
        res.send({ message: "Successfully registered" });
      });
    }
  })(req, res, next);
};

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
    await authModel.forgotPassword(req.user.user_id || req.body.email);
    res.status(200).send({
      msg: "Email sent. Please check your inbox for a reset password link.",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await authModel.resetPassword(
      req.body.email,
      req.body.password,
      req.body.token
    );
    res
      .status(200)
      .send({
        msg: "Your password has been successfully changed. You must log back in.",
      });
  } catch (err) {
    next(err);
  }
};

exports.handleOAuthGoogleRedirect = (req, res) => {
  res
    .status(200)
    .redirect(
      isProduction ? "https://nc-news77.netlify.app" : "http://localhost:3000"
    );
};

exports.handleUnlinkGoogle = async (req, res, next) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.redirect(
        isProduction
          ? "https://nc-news77.netlify.app/login"
          : "http://localhost:3000/login"
      );
    }
    await authModel.removeGoogleCreds(req.user.user_id);
    res.status(200).send({
      msg: "Your Google account is no longer connected this account.",
    });
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
