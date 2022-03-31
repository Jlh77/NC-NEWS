const controller = require("../controllers/");
const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", controller.comments.removeCommentById);

module.exports = commentsRouter;
