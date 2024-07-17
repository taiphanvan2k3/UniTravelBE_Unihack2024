const Post = require("../../models/post.model");
const { logInfo, logError } = require("../logger.service");

const listPersonalPosts = async (authorId, page, limit) => {
    try {
        logInfo("listPersonalPosts", "Start");
        const posts = await Post.find({ authorId })
            .populate({
                path: "author",
                select: "username displayName imageUrl",
            })
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit)
            .exec();

        const result = posts.map((post) => {
            return {
                ...post,
                isLiked: post.likedUserIds.includes(authorId),
            };
        });

        logInfo("listPersonalPosts", "End");
        return result;
    } catch (error) {
        logError("listPersonalPosts", error.message);
        throw error;
    }
};

module.exports = {
    listPersonalPosts,
};
