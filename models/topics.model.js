const db = require("../db/connection");

exports.selectAllTopics = async () => {
  const res = await db.query("SELECT * FROM topics;");
  return res.rows;
};

exports.insertTopic = async (slug, description) => {
  const res = await db.query(
    "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
    [slug, description]
  );
  return res.rows[0];
};
