const { authModel } = require("../models");

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
      req.user.password = undefined;
      req.user.salt = undefined;
      /*res.json({
            email: req.user.email,
            verified: req.user.verified,
            joined: req.user.joined
        });*/
      // for development purposes only
      res.send(req.user);
    }
  } catch (err) {
    next(err);
  }
};

exports.logout;
