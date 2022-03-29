const db = require("../db/connection");

exports.selectAllTopics = async () => {
  const res = await db.query("SELECT * FROM topics");
  return res.rows;
};

exports.selectArticleById = async (article_id) => {
  const query =
    "SELECT articles.*, SUM(comments.article_id)::INT AS comment_count FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;";
  const res = await db.query(query, [article_id]);
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return res.rows[0];
};

exports.updateArticleById = async (article_id, inc_votes) => {
  const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;
  const res = await db.query(query, [inc_votes, article_id]);
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return res.rows[0];
};

exports.selectAllUsers = async () => {
  const res = await db.query("SELECT username FROM users;");
  return res.rows;
};
