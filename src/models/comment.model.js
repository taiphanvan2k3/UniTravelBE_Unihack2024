const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageUrl: { type: [String], required: false },
    createdAt: { type: Date, default: Date.now },
    parentCommentId: { type: String, required: false },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        required: false,
    },
});

CommentSchema.index({ postId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentCommentId: 1 });
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
