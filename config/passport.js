const passport = require("passport");
const db = require("../db/connection");

const { NODE_ENV } = process.env || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${NODE_ENV}`,
});

/* ---------- PassportJS Configuration ---------- */

require("./strats/local");

/* ---------- Social Strategies ---------- */

// Google
require("./strats/google");
// Facebook
require("./strats/facebook");

// passport session setup
// required for persistent login sessions
// passport needs ability to serialize and deserialize users out of session

// Used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Used to deserialize the user
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query(
      "SELECT user_id, username, name, email, avatar_url, verified, google_id, google_display_name, google_email, facebook_id, facebook_email, joined FROM users WHERE user_id = $1;",
      [id]
    );
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});
