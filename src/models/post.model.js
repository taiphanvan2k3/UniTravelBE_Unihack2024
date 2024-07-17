const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        // authorId: Firebase user id
        authorId: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        content: { type: String, required: true },
        mediaUrls: { type: [String], required: false },
        createdAt: { type: Date, default: Date.now },
        commentCount: { type: Number, default: 0 },
        likeCount: { type: Number, default: 0 },
        likedUserIds: { type: [String], default: [] },
        likedUsers: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

PostSchema.set("toObject", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        const authorId = ret.author;
        delete ret.author;
        delete ret._id;
        delete ret.__v;
        ret.authorId = authorId;
    },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
