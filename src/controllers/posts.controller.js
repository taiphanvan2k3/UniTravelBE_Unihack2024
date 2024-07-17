const postDetailService = require("../services/post/post-detail.service.js");

class PostsController {
    async createNewPost(req, res, next) {
        try {
            const { title, content } = req.body;
            const { images, videos } = req.files;
            const newPost = await postDetailService.createNewPost({
                title,
                content,
                images,
                videos,
            });

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
            const newComment = await postDetailService.addComment({
                postId,
                content,
            });
            res.status(201).json(newComment);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostsController();
