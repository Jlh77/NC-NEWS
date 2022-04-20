const db = require("../db/connection");
const format = require("pg-format");

exports.selectAllArticles = async (
  topic = "%%",
  sort_by = "created_at",
  order = "DESC"
) => {
  let query = format(
    `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.topic ILIKE %L
    GROUP BY articles.article_id 
    ORDER BY %I`,
    topic,
    sort_by
  );
  query += order === "DESC" ? " DESC;" : " ASC;";
  const res = await db.query(query);
  return res.rows;
};

exports.insertArticle = async ({ author, title, body, topic }) => {
  const query =
    "INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;";
  const res = await db.query(query, [author, title, body, topic]);
  return res.rows[0];
};

exports.selectArticleById = async (article_id) => {
  const query =
    "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;";
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

exports.selectArticleCommentsById = async (article_id) => {
  const query = "SELECT * FROM comments WHERE article_id = $1";
  const res = await db.query(query, [article_id]);
  return res.rows;
};

exports.insertArticleCommentById = async (article_id, username, body) => {
  const query = `INSERT INTO comments (
      article_id,
      votes,
      created_at,
      author,
      body
    ) VALUES (
      $1,
      0,
      CURRENT_TIMESTAMP,
      $2,
      $3
    ) RETURNING *;`;
  const res = await db.query(query, [article_id, username, body]);
  return res.rows[0];
};
