const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics").then((res) => {
    return res.rows;
  });
};

exports.selectArticleById = async (article_id) => {
  const res = await db.query("SELECT * FROM articles WHERE article_id = $1;", [
    article_id,
  ]);
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return res.rows[0];
};
