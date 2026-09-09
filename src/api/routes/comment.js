const express = require("express");
const commentsRouter = express.Router();
const { getCommentsByPost, createComment, deleteComment } = require("../controllers/comment");
const { isAuth } = require("../../middlewares/isAuth");

commentsRouter.get("/:postId", getCommentsByPost);
commentsRouter.post("/:postId", isAuth, createComment);
commentsRouter.delete("/:id", isAuth, deleteComment);

module.exports = commentsRouter;