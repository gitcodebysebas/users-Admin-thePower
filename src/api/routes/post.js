const express = require("express");
const postsRouter = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/post");
const { isAuth } = require("../../middlewares/isAuth");
const { upload } = require("../../middlewares/file");

postsRouter.get("/", getPosts);
postsRouter.get("/:id", getPostById);
postsRouter.post("/", isAuth, upload.single("img"), createPost);
postsRouter.put("/:id", isAuth, updatePost);
postsRouter.delete("/:id", isAuth, deletePost);

module.exports = postsRouter;