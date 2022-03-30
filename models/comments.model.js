const db = require("../db/connection");

exports.deleteCommentById = async (comment_id) => {
  const query = "DELETE FROM comments WHERE comment_id = $1 RETURNING *";
  const res = await db.query(query, [comment_id]);
  if (!res.rows.length)
    return Promise.reject({ status: 404, msg: "Comment does not exist" });
  return;
};
