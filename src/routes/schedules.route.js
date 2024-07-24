const Router = require("express");
const schedulesController = require("../controllers/schedules.controller.js");
const router = Router();

/**
 * @swagger
 * /schedules/get-by-province/{provinceCode}/{numDays}:
 *   get:
 *     summary: Get schedule AI from Gemini by province code over multiple days
 *     tags:
 *       - SchedulesController
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         schema:
 *           type: string
 *         required: true
 *         description: provinceCode of the province
 *       - in: path
 *         name: numDays
 *         schema:
 *           type: integer
 *         required: true
 *         description: Number of days for the itinerary
 *     responses:
 *       200:
 *        description: Get schedule AI from Gemini by province code multi-day
 */
router.get("/get-by-province/:provinceCode/:numDays", schedulesController.getScheduleAI);

/**
 * @swagger
 * /schedules/get-by-experience-location/{experienceLocationId}/{numDays}:
 *   get:
 *     summary: Get schedule AI from Gemini for a specific location over multiple days
 *     tags:
 *       - SchedulesController
 *     parameters:
 *       - in: path
 *         name: experienceLocationId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the experience location
 *       - in: path
 *         name: numDays
 *         schema:
 *           type: integer
 *         required: true
 *         description: Number of days for the itinerary
 *     responses:
 *       200:
 *        description: Successfully generated multi-day schedule from Gemini
 *       404:
 *        description: Location not found
 */
router.get("/get-by-experience-location/:experienceLocationId/:numDays", schedulesController.getScheduleForSpecificLocation);
module.exports = router;