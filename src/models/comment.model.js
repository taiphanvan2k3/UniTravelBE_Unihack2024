const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageUrls: { type: [String], required: false },
    videoUrls: { type: [String], required: false },
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
