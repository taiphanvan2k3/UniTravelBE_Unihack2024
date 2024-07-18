const Router = require("express");
const experienceLocationController = require("../controllers/experience-locations.controller.js");
const verifyToken = require("../middlewares/firebase-auth.middleware.js");
const handleUpload = require("../middlewares/multipart-upload-support.middleware.js");
const router = Router();
const MAX_IMAGE_COUNT = 5;
const MAX_VIDEO_COUNT = 2;

/**
 * @swagger
 * /experience-locations/top:
 *  get:
 *    summary: Get top experience locations by limit
 *    tags:
 *      - ExperienceLocationController
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        default: 10
 *        description: Number of experience locations to retrieve
 *        required: true
 *    responses:
 *       200:
 *         description: List of top experience locations
 */
router.get("/top", experienceLocationController.getTopExperienceLocations);

/**
 * @swagger
 * /experience-locations/get-detail/{id}:
 *   get:
 *     summary: Get detail of an experience location
 *     tags:
 *       - ExperienceLocationController
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Experience location id
 *     responses:
 *       200:
 *         description: Detail of an experience location
 *       404:
 *         description: Experience location not found
 */
router.get(
    "/get-detail/:id",
    experienceLocationController.getExperienceLocationsById
);

/**
 * @swagger
 * /experience-locations/create-detail:
 *   post:
 *     summary: Create a new experience location
 *     tags:
 *       - ExperienceLocationController
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationName:
 *                 type: string
 *               thumbnailUrl:
 *                 type: string
 *               address:
 *                 type: string
 *               time:
 *                 type: string
 *                 description: Operating hours or time information
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created a new experience location
 *       400:
 *         description: Invalid input data
 */
router.post(
    "/create-detail",
    experienceLocationController.createExperienceLocation
);

/**
 * @swagger
 * /experience-locations/{id}:
 *   put:
 *     summary: Update an experience location by ID
 *     tags:
 *       - ExperienceLocationController
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the experience location to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationName:
 *                 type: string
 *               thumbnailUrl:
 *                 type: string
 *               address:
 *                 type: string
 *               time:
 *                 type: string
 *                 description: Operating hours or time information
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated the experience location
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Experience location not found
 */
router.put("/:id", experienceLocationController.updateExperienceLocationById);

/**
 * @swagger
 * /experience-locations/{id}:
 *   delete:
 *     summary: Delete an experience location by ID
 *     tags:
 *       - ExperienceLocationController
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the experience location to delete
 *     responses:
 *       204:
 *         description: Successfully deleted the experience location
 *       404:
 *         description: Experience location not found
 */
router.delete(
    "/:id",
    experienceLocationController.deleteExperienceLocationById
);

/**
 * @swagger
 * /experience-locations/{id}/create-post:
 *   post:
 *     summary: Create a new post in an experience location
 *     tags:
 *       - ExperienceLocationController
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 5 images at most
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Only upload 2 videos at most
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Invalid input
 */
router.post(
    "/:id/create-post",
    verifyToken,
    handleUpload(MAX_IMAGE_COUNT, MAX_VIDEO_COUNT),
    experienceLocationController.createNewPost
);

module.exports = router;
