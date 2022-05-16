const passport = require("passport");
const db = require("../db/connection");

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
  const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    id,
  ]);
  done(err, rows[0]);
});
