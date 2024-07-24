const postDetailService = require("../services/post/post-detail.service.js");
const listOfPostsService = require("../services/post/list-posts.service.js");

class PostsController {
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
