const passport = require("passport");
const db = require("../../db/connection");

/**
 * FACEBOOK STRATEGY
 *
 * Used for both authenticating and linking of accounts
 */

const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy( // Default name facebook
    {
      clientID: process.env.facebook_APP_ID,
      clientSecret: process.env.facebook_APP_SECRET,
      callbackURL: process.env.facebook_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // If user is logged in, proceed to simply link account
      if (req.user) {
        try {
          req.user.facebook_id = profile.id;
          req.user.facebook_email = profile.email;

          const { rows } = await db.query(
            "UPDATE users SET facebook_id = $1, facebook_email = $2 WHERE user_id = $3;",
            [req.user.facebook_id, req.user.facebook_email, req.user.id]
          );
          // No error (fb account not already in use) link and return updated user
          return done(null, req.user);
        } catch (err) {
          // If facebook account is duplicate (linked to different account) will return error
          return done(null, false, {
            success: false,
            message:
              "The Facebook account you tried to link is already associated with another account.",
          }); //IMPORTANT Error flash not working, fix
        }
      }

      // If not logged in
      else {
        try {
          // Check if facebook account is registered
          let res = await db.query(
            "SELECT * FROM users WHERE facebook_id = $1;",
            [profile.id]
          );
          let rows = res.rows;

          // If user already registered, log in
          if (rows.length) {
            return done(null, rows[0]);
          }

          // Check if email in use before inserting, if so link and login
          res = await db.query("SELECT * FROM users WHERE email = $1;", [
            profile.email,
          ]);
          rows = res.rows;

          if (rows.length) {
            const existingUser = rows[0];
            existingUser.facebook_id = profile.id;
            existingUser.facebook_email = profile.email;

            const rows = await db.query(
              "UPDATE users SET facebook_id = $1, facebook_email = $2 WHERE user_id = $3;",
              [
                existingUser.facebook_id,
                existingUser.facebook_email,
                existingUser.user_id,
              ]
            );
            return done(null, existingUser);
          }
          // If no existing record, register the user.
          else {
            const newUser = {
              email: profile.email,
              // facebook account specific fields
              facebook_id: profile.id,
              method: "fb", // This field ties this new user to the facebook account
              // General fields (taken from the stuff facebook gives us)
              name:
                profile.name.first_name && profile.name.last_name
                  ? `${profile.name.first_name} ${profile.name.last_name}`
                  : "",
              facebook_email: profile.email,
              avatar_url: profile.picture,
            };

            const { rows } = await db.query(
              "INSERT INTO users (email, facebook_id, original_method, name, facebook_email, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
              [
                newUser.email,
                newUser.facebook_id,
                newUser.method,
                newUser.name,
                newUser.facebook_email,
                newUser.avatar_url,
              ]
            );
            return done(null, rows[0]);
          }
        } catch (err) {
          return done(err);
        }
      }
    }
  )
);
