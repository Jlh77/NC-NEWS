const db = require("../db/connection");
const crypto = require("crypto");
const mailer = require("../config/lib/email");
const { genHash } = require("../config/lib/passwordConfig");

exports.forgotPassword = async (email) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1;", [
    email,
  ]);

  // if no account do nothing but no error
  if (!rows.length) {
    return;
  }

  await db.query("UPDATE user_reset_tokens SET used = true WHERE email = $1;", [
    email,
  ]);

  // Create a random reset token
  let token = crypto.randomBytes(64).toString("base64");

  // Set expiry date in 10 minutes
  let expireDate = new Date(new Date().getTime() + 600000);

  await db.query(
    "INSERT INTO user_reset_tokens (email, expiration, token, used) VALUES ($1, $2, $3, $4);",
    [email, expireDate, token, false]
  );

  const message = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Reset Your Password - NC News",
    text: `To reset your password, please click the link below.\n\n
      ${
        process.env.NODE_ENV === "production"
          ? "https://nc-news77.netlify.app/"
          : "http://localhost:3000/"
      }reset-password?token=${encodeURIComponent(token)}&id=${rows[0].user_id}

      "\n\nThis link expires after 10 minutes.\n\nIf you did not request to change your password, you can safely ignore this email.`,
  };

  mailer.send(message);

  console.log("should send email...");
};

exports.resetPassword = async (id, password, token) => {
  const { rows } = await db.query(
    "SELECT * FROM user_reset_tokens WHERE user_id = $1 AND token = $2 AND expiration > CURRENT_TIMESTAMP AND used = $3;",
    [id, token, false]
  );

  if (!rows.length) {
    return Promise.reject({
      status: 400,
      msg: "Link expired or does not exist.",
    });
  }

  // Set token to used, before continuing to reset the password.
  await db.query("UPDATE user_reset_tokens SET used = 1 WHERE email = $1;", [
    rows[0].email,
  ]);

  const saltHash = genHash(password);
  password = "";

  await db.query(
    "UPDATE users SET password = $1, salt = $2 WHERE email = $3;",
    [saltHash.hash, saltHash.salt, rows[0].email]
  );
};

// exports.logoutAllDevices = async (id) => {
//   delete all sessions, not implemented but idea is here
// };

exports.removeGoogleCreds = async (id) => {
  await db.query(
    "UPDATE users SET google_id = $1, google_email = $2, google_display_name = $3 WHERE user_id = $4;",
    [null, null, null, id]
  );
};
