const Router = require("express");
const experienceLocationController = require("../controllers/experience-locations.controller.js");
const router = Router();

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
 * /experience-locations/{id}/posts:
 *   get:
 *     summary: Get posts in an experience location
 *     tags:
 *       - ExperienceLocationController
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the experience location
 *       - in: query
 *         name: pageIndex
 *         required: true
 *         example: 1
 *         schema:
 *           type: integer
 *         description: The index of the page to retrieve
 *       - in: query
 *         name: pageSize
 *         required: true
 *         example: 10
 *         schema:
 *           type: integer
 *         description: The number of posts per page
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The post ID
 *                   experienceLocation:
 *                     type: string
 *                     description: The experience location ID
 *                   author:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                   upvoteCount:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Bad request
 *       404:
 *         description: Experience location not found
 */
router.get(
    "/:id/posts",
    experienceLocationController.getPostsInExperienceLocation
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

module.exports = router;
