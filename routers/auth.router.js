const { auth } = require("../controllers/");
const authRouter = require("express").Router();
const passport = require("passport");

// local

authRouter.route("/login").post((req, res, next) => {
  passport.authenticate("local-login", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info);
    else {
      req.logIn(user, (err) => {
        res.send({ message: "Succesfully logged in" });
      });
    }
  })(req, res, next);
});

authRouter.route("/join").post((req, res, next) => {
  passport.authenticate("local-register", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info);
    else {
      req.logIn(user, (err) => {
        res.send({ message: "Successfully registered" });
      });
    }
  })(req, res, next);
});

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

// get anti-csrf token route

// authRouter.route("/getCSRFToken").get((req, res) => {
//   res.json({ CSRFToken: req.CSRFToken() });
// });

// logged in user api

authRouter.route("/current-user").get(auth.getUserData);

module.exports = authRouter;
