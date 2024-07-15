const Router = require("express");
const provinceController = require("../controllers/provinces.controller.js");
const router = Router();

router.get("/", provinceController.getAllProvinces);
router.get(
    "/:provinceCode/experience-locations",
    provinceController.getListExperienceLocationsByProvince
);

module.exports = router;
