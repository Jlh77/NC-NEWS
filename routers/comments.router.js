const controller = require("../controllers/");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .patch(controller.comments.patchIncCommentVotesById)
  .delete(controller.comments.removeCommentById);

module.exports = commentsRouter;
