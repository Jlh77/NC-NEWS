const { auth } = require("../controllers/");
const authRouter = require("express").Router();
const passport = require("passport");

// local

authRouter.route("/login").post(auth.login);

authRouter.route("/join").post(auth.join);

// logout

authRouter.route("/logout").post(auth.logout);

authRouter.route("/logout-all-devices").post(auth.logoutAllDevices);

// reset password

authRouter.route("/forgot-password").post(auth.forgotPassword);

authRouter.route("/reset-password").post(auth.resetPassword);

// social auth

// google

authRouter.route("/google").get(
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

authRouter.route("/google/redirect").get(
  passport.authenticate("google", {
    failureRedirerct: "/login",
  }),
  auth.handleOAuthGoogleRedirect
);
authRouter.route("/google/unlink").get(auth.handleUnlinkGoogle);

// facebook

// authRouter.route("/facebook").get(auth.handleOAuthFacebook);

// authRouter
//   .route("/facebook/redirect")
//   .get(auth.handleOAuthFacebookRedirect);

// authRouter.route("/facebook/unlink").get(auth.handleUnlinkFacebook);

// logged in user api

authRouter.route("/current-user").get(auth.getUserData);

module.exports = authRouter;
