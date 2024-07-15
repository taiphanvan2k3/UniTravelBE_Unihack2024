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
module.exports = router;
