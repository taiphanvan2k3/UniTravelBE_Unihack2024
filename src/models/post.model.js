const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        experienceLocation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExperienceLocation",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: { type: String, required: true },
        mediaUrls: { type: [String], required: false },
        createdAt: { type: Date, default: Date.now },
        comments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Comment",
            default: [],
        },
        upvoteCount: { type: Number, default: 0 },
        upvoteUsers: {
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

PostSchema.index({ experienceLocation: 1, upvoteCount: -1, createdAt: -1 });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
