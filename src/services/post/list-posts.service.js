const { logInfo, logError } = require("../logger.service");
const { getNamespace } = require("node-request-context");
const appState = getNamespace("AppState");

const User = require("../../models/user.model");
const Post = require("../../models/post.model");

const listPersonalPosts = async (page, limit) => {
    try {
        logInfo("listPersonalPosts", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            throw new Error("User not found");
        }

        const posts = await Post.find({
            author: currentUser._id,
            $or: [
                { imageUrls: { $exists: true, $ne: [] } },
                { videoUrls: { $exists: true, $ne: [] } },
            ],
        })
            .populate({
                path: "author",
                select: "username displayName imageUrl",
            })
            .populate({
                path: "experienceLocation",
                select: "locationName address",
            })
            .populate({
                path: "store",
                select: "name detailAddress",
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const result = posts.map((post) => {
            const postData = post._doc;
            postData.id = postData._id;
            delete postData._id;
            delete postData.__v;
            return {
                ...postData,
                isUpVoted: post.upvoteUsers.includes(currentUserId),
                isDownVoted: post.downvoteUsers.includes(currentUserId),
            };
        });

        logInfo("listPersonalPosts", "End");
        return result;
    } catch (error) {
        logError("listPersonalPosts", error.message);
        throw error;
    }
};

const getPostsInLocation = async (
    locationId,
    locationType,
    pageIndex,
    pageSize
) => {
    try {
        logInfo("getPostsInLocation", "Start");
        const query =
            locationType === "store"
                ? { store: locationId }
                : { experienceLocation: locationId };

        const posts = await Post.find(query)
            .populate({
                path: "author",
                select: "username displayName imageUrl",
                populate: {
                    path: "badges",
                    select: "type, imageUrl",
                },
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 }, limit: 3 },
                select: "content imageUrls videoUrls upvoteCount replies",
                populate: [
                    {
                        path: "user",
                        select: "displayName imageUrl",
                        populate: {
                            path: "badges",
                            select: "type, imageUrl",
                        },
                    },
                    {
                        path: "replies",
                        select: "content imageUrls videoUrls upvoteCount replies",
                        options: { sort: { createdAt: -1 }, limit: 3 },
                    },
                ],
            })
            .sort({ upvoteCount: -1, createdAt: -1 })
            .skip((pageIndex - 1) * pageSize)
            .limit(pageSize);

        logInfo("getPostsInLocation", "End");
        return posts;
    } catch (error) {
        logError("getListExperienceLocationsByProvince", error.message);
        throw error;
    }
};

const getPostsForNewFeeds = async (pageIndex, pageSize) => {
    try {
        logInfo("getPostsForNewFeeds", "Start");
        let postsData = await Post.find({
            $or: [
                { imageUrls: { $exists: true, $ne: [] } },
                { videoUrls: { $exists: true, $ne: [] } },
            ],
        })
            .populate({
                path: "author",
                select: "username displayName imageUrl",
                populate: {
                    path: "badges",
                    select: "type, imageUrl",
                },
            })
            .populate({
                path: "experienceLocation",
                select: "locationName address",
            })
            .populate({
                path: "store",
                select: "name detailAddress",
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 }, limit: 3 },
                select: "content imageUrls videoUrls upvoteCount replies",
                populate: [
                    {
                        path: "user",
                        select: "displayName imageUrl badges",
                        populate: {
                            path: "badges",
                            select: "type, imageUrl",
                        },
                    },
                    {
                        path: "replies",
                        select: "content imageUrls videoUrls upvoteCount replies",
                        options: { sort: { createdAt: -1 }, limit: 3 },
                    },
                ],
            })
            .sort({ createdAt: -1 })
            .skip((pageIndex - 1) * pageSize)
            .limit(pageSize)
            .exec();

        logInfo("getPostsForNewFeeds", "End");
        return postsData;
    } catch (error) {
        logError("getPostsForNewFeeds", error.message);
        throw error;
    }
};

module.exports = {
    listPersonalPosts,
    getPostsForNewFeeds,
    getPostsInLocation,
};
