const Router = require("express");
const provinceController = require("../controllers/provinces.controller.js");
const router = Router();

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Get all provinces
 *     tags:
 *       - ProvinceController
 *     responses:
 *       200:
 *        description: List of provinces
 */
router.get("/", provinceController.getAllProvinces);

/**
 * @swagger
 * /provinces/{provinceCode}/experience-locations:
 *   get:
 *     summary: Get experience locations by province code
 *     tags:
 *       - ProvinceController
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of experience locations by province code
 */
router.get(
    "/:provinceCode/experience-locations",
    provinceController.getListExperienceLocationsByProvince
);

module.exports = router;
