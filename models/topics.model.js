const db = require("../db/connection");

exports.selectAllTopics = async () => {
  const res = await db.query("SELECT * FROM topics");
  return res.rows;
};
