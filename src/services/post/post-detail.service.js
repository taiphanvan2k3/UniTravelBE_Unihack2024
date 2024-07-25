const fs = require("fs");
const { logInfo, logError } = require("../logger.service.js");
const { uploadFileFromFilePath } = require("../firestore-utils.service");
const { getNamespace } = require("node-request-context");
const appState = getNamespace("AppState");
const UPLOAD_TYPES = {
    post: "post",
    comment: "comment",
};
const {
    mileStoneRange,
    mileStones,
} = require("../../services/voucher/milestone.js");

const Post = require("../../models/post.model.js");
const User = require("../../models/user.model.js");
const Comment = require("../../models/comment.model.js");
const Store = require("../../models/store.model.js");
const ExperienceLocation = require("../../models/experience-location.model.js");
const CheckInHistory = require("../../models/checkin-history.model.js");
const Voucher = require("../../models/voucher.model.js");
const UserVoucher = require("../../models/user-voucher.model.js");

const createNewPost = async (locationId, locationType, postInfo) => {
    try {
        logInfo("createNewPost", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const [currentUser, store, experienceLocation] = await Promise.all([
            User.findById(currentUserId),
            Store.findById(locationId),
            ExperienceLocation.findById(locationId),
        ]);

        if (!currentUser) {
            throw new Error("User not found");
        }

        let newPost = null;
        if (locationType === "experienceLocation") {
            if (!experienceLocation) {
                throw new Error("Experience location not found");
            }
            newPost = new Post({
                ...postInfo,
                experienceLocation: locationId,
                author: currentUser._id,
            });
        } else {
            if (!store) {
                throw new Error("Store not found");
            }
            newPost = new Post({
                ...postInfo,
                store: locationId,
                author: currentUser._id,
            });
        }

        await newPost.save();
        const postId = newPost._id;

        // Không cần chờ upload file xong mới trả về response
        uploadFilesToFirebaseStorage(
            {
                postId,
            },
            UPLOAD_TYPES.post,
            postInfo.images,
            postInfo.videos
        );

        logInfo("createNewPost", "End");
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
        const [currentUser, post] = await Promise.all([
            User.findById(currentUserId),
            Post.findById(postId),
        ]);

        if (!currentUser) {
            throw new Error("User not found");
        }

        const newComment = new Comment({
            content: commentInfo.content,
            user: currentUser._id,
            post: postId,
            parentCommentId: null,
        });
        post.comments.push(newComment._id);

        await newComment.save();
        const commentId = newComment._id;
        await post.save();

        uploadFilesToFirebaseStorage(
            {
                postId,
                commentId,
            },
            UPLOAD_TYPES.comment,
            commentInfo.images,
            commentInfo.videos
        );

        logInfo("addComment", "End");
        return newComment.toObject();
    } catch (error) {
        logError("addComment", error);
        throw error;
    }
};

const addReplyComment = async (postId, parentCommentId, commentInfo) => {
    try {
        logInfo("addReplyComment", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const [currentUser, parentComment] = await Promise.all([
            User.findById(currentUserId),
            Comment.findById(parentCommentId),
        ]);

        if (!currentUser || !parentComment) {
            throw new Error("User or Parent Comment not found");
        }

        const newComment = new Comment({
            content: commentInfo.content,
            user: currentUser._id,
            post: postId,
            parentCommentId,
        });

        const commentId = newComment._id;
        parentComment.replies.push(commentId);
        await Promise.all([newComment.save(), parentComment.save()]);
        uploadFilesToFirebaseStorage(
            {
                postId,
                commentId,
            },
            UPLOAD_TYPES.comment,
            commentInfo.images,
            commentInfo.videos
        );
    } catch (error) {
        logError("addReplyComment", error);
        throw error;
    }
};

const upvotePost = async (postId) => {
    try {
        logInfo("upvotePost", "Start");
        const currentUserId = appState.context.currentUser.userIdInSystem;
        const [currentUser, post] = await Promise.all([
            User.findById(currentUserId),
            Post.findById(postId),
        ]);

        if (!currentUser || !post) {
            throw new Error("User or Post not found");
        }

        const isUpvoteOnStore = post.store ? true : false;
        const isCheckIn = isUpvoteOnStore
            ? await CheckInHistory.exists({
                  user: currentUser._id,
                  store: post.store,
              })
            : await CheckInHistory.exists({
                  user: currentUser._id,
                  experienceLocation: post.experienceLocation,
              });
        if (!isCheckIn) {
            throw new Error("401-User has not checked in yet");
        }

        if (post.upvoteUsers.includes(currentUser._id)) {
            post.upvoteUsers = post.upvoteUsers.filter(
                (userId) => userId.toString() !== currentUser._id.toString()
            );
            post.upvoteCount -= 1;
        } else {
            post.upvoteUsers.push(currentUser._id);
            post.upvoteCount += 1;
        }

        let author = null;
        if (mileStones[post.upvoteCount]) {
            author = await User.findById(post.author);
            let existingMileStone = author.mileStonePosts?.find(
                (mileStone) => mileStone.voteMilestone === post.upvoteCount
            );
            if (existingMileStone) {
                existingMileStone.quantity += 1;
            } else {
                author.mileStonePosts.push({
                    voteMilestone: post.upvoteCount,
                    quantity: 1,
                });
                existingMileStone = author.mileStonePosts[0];
            }

            // Tạo voucher
            const voucherMileStone = mileStones[post.upvoteCount];
            const rangeOfVoucher = mileStoneRange[voucherMileStone];
            if (rangeOfVoucher.includes(existingMileStone.quantity)) {
                const voucher = await Voucher.findOne({
                    code: voucherMileStone,
                });

                const voucherForUser = new UserVoucher({
                    user: author._id,
                    voucher: voucher._id,
                    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });
                await voucherForUser.save();
            }
        }

        if (!author) {
            await post.save();
        } else {
            await Promise.all([post.save(), author.save()]);
        }
        logInfo("upvotePost", "End");
    } catch (error) {
        logError("upvotePost", error);
        throw error;
    }
};

const uploadFilesToFirebaseStorage = async (
    identifiers,
    uploadType,
    images,
    videos
) => {
    const files = [];
    try {
        logInfo("uploadFilesToFirebaseStorage", "Start");
        const bucketName = "post-media";

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

        const imageUploadPromises =
            images && images.length > 0
                ? images.map((image) =>
                      uploadFileFromFilePath(image.path, bucketName)
                  )
                : [];

        const videoUploadPromises =
            videos && videos.length > 0
                ? videos.map((video) =>
                      uploadFileFromFilePath(video.path, bucketName)
                  )
                : [];

        const mediaUrls = await Promise.all([
            ...imageUploadPromises,
            ...videoUploadPromises,
        ]);

        const imageUrls = mediaUrls.slice(0, images?.length ?? 0);
        const videoUrls = mediaUrls.slice(images?.length ?? 0);

        if (uploadType == UPLOAD_TYPES.post) {
            const post = await Post.findById(identifiers.postId);
            post.imageUrls = imageUrls;
            post.videoUrls = videoUrls;
            await post.save();
        } else if (uploadType == UPLOAD_TYPES.comment) {
            const [comment, post] = await Promise.all([
                Comment.findById(identifiers.commentId),
                Post.findById(identifiers.postId),
            ]);

            if (!comment || !post) {
                throw new Error("Comment or Post not found");
            }

            comment.imageUrls = imageUrls;
            comment.videoUrls = videoUrls;
            await Promise.all([comment.save(), post.save()]);
        }

        logInfo("uploadFilesToFirebaseStorage", "End");
    } catch (error) {
        logError("uploadFilesToFirebaseStorage", error);
        throw error;
    } finally {
        files.forEach((file) => {
            fs.unlinkSync(file.path);
        });
    }
};

module.exports = {
    createNewPost,
    addComment,
    addReplyComment,
    upvotePost,
};
