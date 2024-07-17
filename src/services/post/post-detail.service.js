const fs = require("fs");
const Post = require("../../models/post.model.js");
const User = require("../../models/user.model.js");
const Comment = require("../../models/comment.model.js");
const { logInfo, logError } = require("../logger.service.js");
const { getNamespace } = require("node-request-context");
const { uploadFileFromFilePath } = require("../firestore-utils.service");
const appState = getNamespace("AppState");

const createNewPost = async (postInfo) => {
    try {
        logInfo("createNewPost", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            throw new Error("User not found");
        }

        const newPost = new Post({
            ...postInfo,
            authorId: currentUserId,
            author: currentUser._id,
        });

        await newPost.save();
        const postId = newPost._id;

        // Không cần chờ upload file xong mới trả về response
        uploadFilesToFirebaseStorage(postInfo.images, postInfo.videos, postId);
        return newPost.toObject();
    } catch (error) {
        logError("createNewPost", error);
        throw error;
    }
};

const addComment = async (postId, commentInfo) => {
    try {
        logInfo("addComment", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            throw new Error("User not found");
        }

        const newComment = new Comment({
            ...commentInfo,
            userId: currentUserId,
            user: currentUser._id,
            postId,
            parentCommentId: null,
        });
        await newComment.save();
    } catch (error) {
        logError("addComment", error);
        throw error;
    }
};

const uploadFilesToFirebaseStorage = async (images, videos, postId) => {
    try {
        logInfo("uploadFilesToFirebaseStorage", "Start");
        const bucketName = "post-media";

        const files = [];
        if (images) {
            images.forEach((image) => {
                files.push(image);
            });
        }
        if (videos) {
            videos.forEach((video) => {
                files.push(video);
            });
        }

        const promises = files.map((file) =>
            uploadFileFromFilePath(file.path, bucketName)
        );

        const mediaUrls = await Promise.all(promises);
        const post = await Post.findById(postId);
        post.mediaUrls = mediaUrls;
        await post.save();

        logInfo("uploadFilesToFirebaseStorage", "End");

        // Xử lý xóa file sau khi đã upload lên storage
        files.forEach((file) => {
            fs.unlinkSync(file.path);
        });
    } catch (error) {
        logError("uploadFilesToFirebaseStorage", error);
        throw error;
    }
};

module.exports = {
    createNewPost,
    addComment,
};
