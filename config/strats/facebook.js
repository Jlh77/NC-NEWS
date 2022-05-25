const passport = require("passport");
const db = require("../../db/connection");

/**
 * FACEBOOK STRATEGY
 *
 * Used for both authenticating and linking of accounts
 *
 * IMPORTANT This has not been tested or implemented yet, its just an example of what would be done similar to the google strat.
 */

const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy( // Default name facebook
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // If user is logged in, proceed to simply link account
      if (req.user) {
        try {
          req.user.facebook_id = profile.id;
          req.user.facebook_email = profile.email;

          await db.query(
            "UPDATE users SET facebook_id = $1, facebook_email = $2 WHERE user_id = $3;",
            [req.user.facebook_id, req.user.facebook_email, req.user.id]
          );

          // No error (facebook account not already in use) link and return updated user
          return done(null, req.user);
        } catch (err) {
          // If facebook account is duplicate (linked to different account) will return error
          return done(null, false, {
            success: false,
            msg: "The Facebook account you tried to link is already associated with another account.",
          });
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
          const userIdToLinkTo = rows[0]?.user_id;

          if (rows.length) {
            const { rows } = await db.query(
              "UPDATE users SET facebook_id = $1, facebook_email = $2, facebook_display_name = $3 WHERE user_id = $4 RETURNING *;",
              [
                profile.id,
                profile.emails[0].value,
                profile.displayName,
                userIdToLinkTo,
              ]
            );
            return done(null, rows[0]);
          }
          // If no existing record, register the user.
          else {
            const name = profile.name || "";

            // Specific to this platform, will try display_name as username else create random username
            try {
              const { rows } = await db.query(
                "INSERT INTO users (username, email, facebook_id, original_method, name, facebook_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
                [
                  `user${Math.random().toString().substr(2, 8)}`,
                  profile.email,
                  profile.id,
                  "go",
                  name,
                  profile.email,
                ]
              );
              return done(null, rows[0]);
            } catch (err) {}
          }
        } catch (err) {
          return done(err);
        }
      }
    }
  )
);
