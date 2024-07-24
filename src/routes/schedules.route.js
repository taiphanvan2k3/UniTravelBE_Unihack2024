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
 * /schedules/get-by-experience-location/{experienceLocationId}:
 *   get:
 *     summary: Get schedule AI from Gemini for a specific location
 *     tags:
 *       - SchedulesController
 *     parameters:
 *       - in: path
 *         name: experienceLocationId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the experience location
 *     responses:
 *       200:
 *        description: Successfully generated multi-day schedule from Gemini
 *       404:
 *        description: Location not found
 */
router.get("/get-by-experience-location/:experienceLocationId", schedulesController.getScheduleForSpecificLocation);

// POST - Create a new schedule
/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [SchedulesController]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - schedule
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: ['province', 'location']
 *               location:
 *                 type: string
 *                 description: "Object ID of the specific location (required if type is 'location')"
 *               province:
 *                 type: string
 *                 description: "Object ID of the province (required if type is 'province')"
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - day
 *                     - activities
 *                   properties:
 *                     day:
 *                       type: number
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - time
 *                           - title
 *                           - description
 *                         properties:
 *                           time:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           subActivities:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 description:
 *                                   type: string
 *               numDays:
 *                 type: number
 *                 default: 1
 *                 description: "Number of days for the itinerary"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Error in request data
 */
router.post("/", schedulesController.createSchedule);

// GET - Retrieve all schedules
/**
 * @swagger
 * /schedules/getListOfSchedule:
 *   get:
 *     summary: Get all schedules
 *     tags: [SchedulesController]
 *     responses:
 *       200:
 *         description: A list of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 */
router.get("/getListOfSchedule", schedulesController.getListOfSchedule);

// GET - Retrieve all schedules by province
/**
 * @swagger
 * /schedules/getListOfScheduleByProvince/{provinceId}:
 *   get:
 *     summary: Get all schedules by province
 *     tags: [SchedulesController]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of schedules by province
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 */
router.get("/getListOfScheduleByProvince/:provinceId", schedulesController.getListOfScheduleByProvince);

// GET - Retrieve all schedules by location
/**
 * @swagger
 * /schedules/getListOfScheduleByLocation/{locationId}:
 *   get:
 *     summary: Get all schedules by location
 *     tags: [SchedulesController]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of schedules by location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 */
router.get("/getListOfScheduleByLocation/:locationId", schedulesController.getListOfScheduleByLocation);

// GET - Retrieve a specific schedule by ID
/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get a schedule by ID
 *     tags: [SchedulesController]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique id of the schedule
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *       404:
 *         description: Schedule not found
 */
router.get("/:id", schedulesController.getScheduleById);

// PUT - Update a specific schedule by ID
/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update a schedule by ID
 *     tags: [SchedulesController]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique id of the schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Schedule not found
 */
router.put("/:id", schedulesController.updateSchedule);

// DELETE - Delete a specific schedule by ID
/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete a schedule by ID
 *     tags: [SchedulesController]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique id of the schedule to delete
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */
router.delete("/:id", schedulesController.deleteSchedule);
module.exports = router;