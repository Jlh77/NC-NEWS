const db = require("../db/connection");

exports.selectAllUsers = async () => {
  const res = await db.query("SELECT username FROM users;");
  return res.rows;
};

exports.selectUserById = async (username) => {
  const res = await db.query("SELECT * FROM users WHERE username = $1;", [
    username,
  ]);
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return res.rows[0];
};
