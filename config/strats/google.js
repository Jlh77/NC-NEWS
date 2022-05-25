const passport = require("passport");
const db = require("../../db/connection");

/**
 * GOOGLE STRATEGY
 *
 * Used for both authenticating and linking of accounts
 */

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy( // Default name google
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // If user is logged in, proceed to simply link account
      if (req.user) {
        try {
          req.user.google_id = profile.id;
          req.user.google_email = profile.emails[0].value;
          req.user.google_display_name = profile.displayName;

          await db.query(
            "UPDATE users SET google_id = $1, google_email = $2 WHERE user_id = $3;",
            [req.user.google_id, req.user.google_email, req.user.id]
          );

          // No error (google account not already in use) link and return updated user
          return done(null, req.user);
        } catch (err) {
          // If google account is duplicate (linked to different account) will return error
          return done(null, false, {
            success: false,
            msg: "The Google account you tried to link is already associated with another account.",
          }); //IMPORTANT Error flash not working, fix
        }
      }

      // If not logged in
      else {
        try {
          // Check if google account is registered
          let res = await db.query(
            "SELECT * FROM users WHERE google_id = $1;",
            [profile.id]
          );
          let rows = res.rows;

          // If user already registered, log in
          if (rows.length) {
            return done(null, rows[0]);
          }

          // Check if email in use before inserting, if so link and login
          res = await db.query("SELECT * FROM users WHERE email = $1;", [
            profile.emails[0].value,
          ]);
          rows = res.rows;

          if (rows.length) {
            const existingUser = rows[0];
            existingUser.google_email = profile.emails[0].value;
            existingUser.google_display_name = profile.displayName;

            await db.query(
              "UPDATE users SET google_id = $1, google_email = $2 WHERE user_id = $3;",
              [
                existingUser.google_id,
                existingUser.google_email,
                existingUser.user_id,
              ]
            );
            return done(null, existingUser);
          }
          // If no existing record, register the user.
          else {
            const newUser = {
              email: profile.emails[0].value,
              // Google account specific fields
              google_id: profile.id,
              method: "gl", // This field ties this new user to the google account
              // General fields (taken from the stuff google gives us)
              name:
                profile.name.givenName && profile.name.familyName
                  ? `${profile.name.givenName} ${profile.name.familyName}`
                  : "",
              google_email: profile.emails[0].value,
              avatar_url: profile.coverPhoto || null,
            };

            // Specific to this platform, will try display_name as username else create random username
            try {
              const { rows } = await db.query(
                "INSERT INTO users (email, google_id, original_method, name, google_email, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
                [
                  newUser.email,
                  newUser.google_id,
                  newUser.method,
                  newUser.name,
                  newUser.google_email,
                  newUser.avatar_url,
                ]
              );
              return done(null, rows[0]);
            } catch (err) {
              // if username in use (or invalid) create random one
              if (
                err.code === "23505" &&
                err.constraint === "users_username_key"
              ) {
                const { rows } = await db.query(
                  "INSERT INTO users (email, google_id, original_method, name, google_email, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
                  [
                    `user${Math.random().toString().substr(2, 8)}`,
                    newUser.google_id,
                    newUser.method,
                    newUser.name,
                    newUser.google_email,
                    newUser.avatar_url,
                  ]
                );
                return done(null, rows[0]);
              }
            }
          }
        } catch (err) {
          return done(err);
        }
      }
    }
  )
);
