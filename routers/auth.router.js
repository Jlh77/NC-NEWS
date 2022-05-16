const { auth, articles } = require("../controllers/");
const authRouter = require("express").Router();

// local

authRouter.route("/login").post(auth.login);

authRouter.route("/join").post(auth.join);

// logout

authRouter.route("/logout").get(auth.logout);

authRouter.route("/logout-all-devices").get(auth.logoutAllDevices);

// reset password

authRouter.route("/forgot-password").post(auth.forgotPassword);

authRouter.route("/reset-password").post(auth.resetPassword);

// social (auth)

// google

authRouter.route("/oauth/google").get(auth.handleOAuthGoogle);

authRouter.route("/oauth/google/redirect").get(auth.handleOAuthGoogleRedirect);

authRouter.route("/oauth/google/unlink").get(auth.handleUnlinkGoogle);

// facebook

// authRouter.route("/oauth/facebook").get(auth.handleOAuthFacebook);

// authRouter
//   .route("/oauth/facebook/redirect")
//   .get(auth.handleOAuthFacebookRedirect);

// authRouter.route("/oauth/facebook/unlink").get(auth.handleUnlinkFacebook);

// logged in user api

authRouter.route("/current-user").get(auth.getUserData);

module.exports = authRouter;
