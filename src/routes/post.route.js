const Router = require("express");
const router = Router();
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const handleUpload = require("../middlewares/multipart-upload-support.middleware.js");
const postController = require("../controllers/posts.controller.js");
const MAX_IMAGE_COUNT = 5;
const MAX_VIDEO_COUNT = 2;

/**
 * @swagger
 * /posts/{postId}/add-comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags:
 *       - PostController
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Id of
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to add a comment to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 5 images at most
 *                 maxItems: 5
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 2 videos at most
 *                 maxItems: 2
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid input
 */
router.post(
    "/:postId/add-comment",
    verifyToken,
    handleUpload(MAX_IMAGE_COUNT, MAX_VIDEO_COUNT),
    postController.addComment
);

/**
 * @swagger
 * /posts/{postId}/{commentId}/add-reply:
 *   post:
 *     summary: Add a reply to a comment
 *     tags:
 *       - PostController
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *         description: ID of the post to which the comment belongs
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *         description: ID of the comment to which the reply is being added
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 5 images at most
 *                 maxItems: 5
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 2 videos at most
 *                 maxItems: 2
 *     responses:
 *       '201':
 *         description: Successfully created
 *       '400':
 *         description: Invalid input
 */
router.post(
    "/:postId/:commentId/add-reply",
    verifyToken,
    handleUpload(MAX_IMAGE_COUNT, MAX_VIDEO_COUNT),
    postController.addReplyComment
);

module.exports = router;
