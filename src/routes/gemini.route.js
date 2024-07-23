const Router = require("express");
const router = Router();
const geminiController = require("../controllers/gemini.controller.js");
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const handleUpload = require("../middlewares/multipart-upload-support.middleware.js");
const MAX_IMAGE_COUNT = 1;
const MAX_VIDEO_COUNT = 0;

/**
 * @swagger
 * /gemini/translate-menu:
 *   post:
 *     tags:
 *       - GeminiController
 *     summary: Translate menu
 *     description: Translate a menu image to a specified language.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Image file to be translated.
 *               language:
 *                 type: string
 *                 description: Target language code.
 *                 example: "vi"
 *     responses:
 *       200:
 *         description: Translation result.
 *       400:
 *         description: No image uploaded.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/translate-menu",
    verifyToken,
    handleUpload(MAX_IMAGE_COUNT, MAX_VIDEO_COUNT),
    geminiController.translateMenu
);

module.exports = router;
