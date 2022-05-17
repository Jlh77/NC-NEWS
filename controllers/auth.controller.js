const { authModel } = require("../models");

const passport = require("passport");

exports.login = async (req, res, next) => {
  try {
    passport.authenticate("local-login", {
      failureFlash: true,
      successRedirect: "/account",
      failureRedirect: "/login",
    });
  } catch (err) {
    next(err);
  }
};

exports.join = async (req, res, next) => {
  try {
    passport.authenticate("local-register", {
      failureFlash: true,
      successRedirect: "/login",
      failureRedirect: "/join",
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.logout();
    req.flash("flashmsg", "You are now logged out.");
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
};

exports.logoutAllDevices = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      await authModel.logoutAllDevices();
      req.logout();
      req.flash("error", "You have been logged out on all devices.");
      res.redirect("/login");
    } else {
      res.redirect("/login");
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

exports.handleOAuthGoogle = async (req, res, next) => {
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
      delete req.user.password;
      delete req.user.salt;
      /*res.json({
            email: req.user.email,
            verified: req.user.verified,
            joined: req.user.joined
        });*/
      // for development purposes only
      res.send(req.user);
    }
  } catch (err) {}
};

exports.logout;
