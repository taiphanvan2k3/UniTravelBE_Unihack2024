const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
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
        upvoteCount: { type: Number, default: 0 },
        downvoteCount: { type: Number, default: 0 },
        upvoteUsers: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        downvoteUsers: {
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

PostSchema.index({ authorId: 1 });
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
