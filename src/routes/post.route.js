const Router = require("express");
const router = Router();
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const handleUpload = require("../middlewares/multipart-upload-support.middleware.js");
const postController = require("../controllers/posts.controller.js");

const MAX_IMAGE_COUNT = 5;
const MAX_VIDEO_COUNT = 2;
// router.post(
//     "/create",
//     verifyToken,
//     (req, res, next) => {
//         try {
//             const middleware = upload.fields([
//                 { name: "images", maxCount: MAX_IMAGE_COUNT },
//                 { name: "videos", maxCount: MAX_VIDEO_COUNT },
//             ]);
//             middleware(req, res, (err) => {
//                 if (err?.code === "LIMIT_UNEXPECTED_FILE") {
//                     return res.status(400).json({
//                         error: `Too many files ${err.field} to upload`,
//                     });
//                 }
//                 next();
//             });
//         } catch (error) {
//             console.error("Error during file upload:", error);
//             return res.status(500).json({ error: "Error during file upload" });
//         }
//     },
//     postController.createNewPost
// );

router.post(
    "/create",
    verifyToken,
    handleUpload(MAX_IMAGE_COUNT, MAX_VIDEO_COUNT),
    postController.createNewPost
);

module.exports = router;
