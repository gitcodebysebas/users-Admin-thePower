const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title:    { type: String, required: true, trim: true },
        content:  { type: String, required: true },
        img:      { type: String, default: "" },
        author:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // ✅ array de comentarios
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);