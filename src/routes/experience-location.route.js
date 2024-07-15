const Router = require("express");
const experienceLocationController = require("../controllers/experience-locations.controller.js");
const router = Router();

router.get("/top", experienceLocationController.getTopExperienceLocations);
module.exports = router;
