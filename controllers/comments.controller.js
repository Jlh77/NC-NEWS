const { commentsModel } = require("../models");
const isTest = process.env.NODE_ENV === "test";

exports.removeCommentById = async (req, res, next) => {
  try {
    if (!isTest) {
      if (!req.isAuthenticated()) {
        throw {
          status: 401,
          msg: "You must be logged in to delete comments.",
        };
      }
    }

    const { comment_id } = req.params;
    await commentsModel.deleteCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchIncCommentVotesById = async (req, res, next) => {
  try {
    if (!isTest) {
      if (!req.isAuthenticated()) {
        throw {
          status: 401,
          msg: "You must be logged in to upvote comments.",
        };
      }
    }

    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const updatedComment = await commentsModel.updateIncCommentVotesById(
      inc_votes,
      comment_id
    );
    res.status(200).send({ updatedComment });
  } catch (err) {
    next(err);
  }
};
