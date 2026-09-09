require("dotenv").config();
const express = require("express");
const { connectDB }        = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");
const usersRouter    = require("./src/api/routes/user");
const postsRouter    = require("./src/api/routes/post");
const commentsRouter = require("./src/api/routes/comment");

const app = express();

connectDB();
connectCloudinary();

app.use(express.json());

app.use("/api/v1/users",    usersRouter);
app.use("/api/v1/posts",    postsRouter);
app.use("/api/v1/comments", commentsRouter);

app.use((req, res) => {
    return res.status(404).json("Route not found");
});

app.listen(3000, () => {
    console.log("Servidor en: http://localhost:3000");
});