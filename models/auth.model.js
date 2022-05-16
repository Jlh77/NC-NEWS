const db = require("../db/connection");

exports.logoutAllDevices = async (user_id) => {
  let logoutAllQuery =
    'DELETE FROM user_sessions WHERE JSON_EXTRACT(`data`, "$.passport.user") = $1;';
  await db.query(logoutAllQuery, [user_id]);
};
