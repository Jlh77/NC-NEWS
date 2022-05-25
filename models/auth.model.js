const db = require("../db/connection");

exports.logoutAllDevices = async (user_id) => {
  let logoutAllQuery =
    'DELETE FROM user_sessions WHERE JSON_EXTRACT(`data`, "$.passport.user") = $1;';
  await db.query(logoutAllQuery, [user_id]);
  return;
};

exports.removeGoogleCreds = async (id) => {
  await db.query(
    "UPDATE users SET google_id = $1, google_email = $2, google_display_name = $3 WHERE user_id = $4;",
    [null, null, null, id]
  );
};
