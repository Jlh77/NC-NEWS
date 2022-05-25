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

authRouter.route("/logout").post(auth.logout);

authRouter.route("/logout-all-devices").get(auth.logoutAllDevices);

// reset password

authRouter.route("/forgot-password").post(auth.forgotPassword);

authRouter.route("/reset-password").post(auth.resetPassword);

// social (auth)

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
  (req, res) => {
    //auth.handleOAuthGoogleRedirect eventuallly put the cb in here;
    res.status(200).redirect("http://localhost:3000");
  }
);

authRouter.route("/google/unlink").get(auth.handleUnlinkGoogle);

// facebook

// authRouter.route("/facebook").get(auth.handleOAuthFacebook);

// authRouter
//   .route("/facebook/redirect")
//   .get(auth.handleOAuthFacebookRedirect);

// authRouter.route("/facebook/unlink").get(auth.handleUnlinkFacebook);

// get anti-csrf token route

// authRouter.route("/getCSRFToken").get((req, res) => {
//   res.json({ CSRFToken: req.CSRFToken() });
// });

// logged in user api

authRouter.route("/current-user").get(auth.getUserData);

module.exports = authRouter;
