const postDetailService = require("../services/post/post-detail.service.js");
const listOfPostsService = require("../services/post/list-posts.service.js");

class PostsController {
    async createNewPost(req, res, next) {
        try {
            // Location này có thể là experienceLocationId hoặc storeId
            const locationId = req.params.id;
            const { content, locationType } = req.body;
            const { images, videos } = req.files;

            if (
                locationType !== "experienceLocation" &&
                locationType !== "store"
            ) {
                return res.status(400).json({
                    message: "Invalid location type",
                });
            }

            const newPost = await postDetailService.createNewPost(
                locationId,
                locationType,
                {
                    content,
                    images,
                    videos,
                }
            );

            res.status(201).json({
                data: newPost,
                hasUploadMedia: images?.length > 0 || videos?.length > 0,
            });
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
            next(error);
        }
    }

    async addComment(req, res, next) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            const { images, videos } = req.files;
            const newComment = await postDetailService.addComment(postId, {
                content,
                images,
                videos,
            });

            res.status(201).json(newComment);
        } catch (error) {
            next(error);
        }
    }

    async addReplyComment(req, res, next) {
        try {
            const { postId, commentId } = req.params;
            const { content } = req.body;
            const { images, videos } = req.files;
            const newComment = await postDetailService.addReplyComment(
                postId,
                commentId,
                {
                    content,
                    images,
                    videos,
                }
            );

            res.status(201).json(newComment);
        } catch (error) {
            next(error);
        }
    }

    async upvotePost(req, res, next) {
        try {
            const { postId } = req.params;
            await postDetailService.upvotePost(postId);

            res.status(200).json({
                message: "Upvote post successfully",
            });
        } catch (error) {
            if (error.message.includes("-")) {
                const [statusCode, message] = error.message.split("-");
                return res.status(statusCode).json({
                    message,
                });
            }
            next(error);
        }
    }

    async getListOfNewFeeds(req, res, next) {
        try {
            const { pageIndex, pageSize } = req.query;
            const posts = await listOfPostsService.getPostsForNewFeeds(
                pageIndex,
                pageSize
            );

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    async getListOfPersonalPosts(req, res, next) {
        try {
            const { pageIndex, pageSize } = req.query;
            const posts = await listOfPostsService.listPersonalPosts(
                pageIndex,
                pageSize
            );

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostsController();
