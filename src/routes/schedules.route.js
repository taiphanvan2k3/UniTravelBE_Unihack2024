const Router = require("express");
const schedulesController = require("../controllers/schedules.controller.js");
const router = Router();

/**
 * @swagger
 * /schedules/get-by-province/{provinceCode}:
 *   get:
 *     summary: Get schedule AI from Gemini by province code
 *     tags:
 *       - schedulesController
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Get schedule AI from Gemini by province code
 */
router.get("/get-by-province/:provinceCode", schedulesController.getScheduleAI);

/**
 * @swagger
 * /schedules/get-by-experience-location/{experienceLocationId}:
 *   get:
 *     summary: Get schedule AI from Gemini by experience location
 *     tags:
 *       - schedulesController
 *     parameters:
 *       - in: path
 *         name: experienceLocationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *        description: Get schedule AI from Gemini by experience location
 */
router.get("/get-by-experience-location/:experienceLocationId", schedulesController.getScheduleForSpecificLocation);
module.exports = router;