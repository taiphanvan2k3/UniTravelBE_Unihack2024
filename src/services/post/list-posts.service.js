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
            .skip((page - 1) * limit)
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

const getPostsInExperienceLocation = async (
    experienceLocationId,
    pageIndex,
    pageSize
) => {
    try {
        logInfo("getPostsInExperienceLocation", "Start");
        const posts = await Post.find({
            experienceLocation: experienceLocationId,
        })
            .populate("author", "displayName imageUrl")
            .sort({ upvoteCount: -1, createdAt: -1 })
            .skip((pageIndex - 1) * pageSize)
            .limit(pageSize);

        logInfo("getPostsInExperienceLocation", "End");
        return posts;
    } catch (error) {
        logError("getListExperienceLocationsByProvince", error.message);
        throw error;
    }
};

module.exports = {
    listPersonalPosts,
    getPostsInExperienceLocation,
};
