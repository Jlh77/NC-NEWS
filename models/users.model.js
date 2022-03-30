const db = require("../db/connection");

exports.selectAllUsers = async () => {
  const res = await db.query("SELECT username FROM users;");
  return res.rows;
};
