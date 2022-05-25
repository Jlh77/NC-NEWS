const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../../db/connection");
const { genHash, validate } = require("../lib/passwordConfig");

// Local login strategy
passport.use(
  "local-login",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
      try {
        // callback with email and password from our form
        const { rows } = await db.query(
          "SELECT * FROM users WHERE email = $1;",
          [email]
        );
        if (!rows.length) {
          return done(null, false, { msg: "Wrong email or password." }); // req.flash is the way to set flashdata using connect-flash
        }
        if (rows[0].salt === null || rows[0].password === null) {
          // User hasn't created a password because they signed up with social
          return done(null, false, {
            msg: "You signed up using an external account. Please either login using your social media account, or you can create a password by clicking forgot password below.",
          });
        }
        const isValid = validate(password, rows[0].password, rows[0].salt);
        // if the user is found but the password is wrong
        if (!isValid)
          return done(null, false, { msg: "Wrong email or password." }); // create the loginMessage and save it to session as flashdata

        // all is well, but first, check the remember parameter to decide cookie (defaults to 3 months)
        if (!req.body.remember) req.session.cookie.expires = false;
        // return successful user
        return done(null, rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Local register strategy
passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
      // find a user whose email is the same as the forms email
      try {
        const username = req.body.username;
        const { rows } = await db.query(
          "SELECT * FROM users WHERE email = $1;",
          [email]
        );

        if (
          rows.length &&
          (rows[0].salt === null || rows[0].password === null)
        ) {
          return done(null, false, {
            msg: "You signed up using an external account. Please either log in using your social media account, or you can create a password by clicking forgot password below.",
          });
        }
        if (rows.length) {
          return done(null, false, {
            msg: "This email is already registered.",
          });
        } else {
          // if there is no user with that email
          // create the user
          const saltHash = genHash(password);
          password = "";

          let newUser = {
            email: email.toLowerCase(),
            username,
            password: saltHash.hash,
            salt: saltHash.salt,
          };

          const { rows } = await db.query(
            "INSERT INTO users (email, username, password, salt, original_method) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
            [
              newUser.email,
              newUser.username,
              newUser.password,
              newUser.salt,
              "lo",
            ]
          );

          return done(null, rows[0]);
        }
      } catch (err) {
        return done(err, null, {
          msg: "An error has occured, Please try again.",
        });
      }
    }
  )
);
