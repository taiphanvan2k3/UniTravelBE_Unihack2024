const listOfProvincesService = require("../services/province/list-of-provinces.service.js");
const listOfExperienceLocationService = require("../services/experience-location/list-of-experience-locations.service.js");

class ProvincesController {
    async getAllProvinces(req, res, next) {
        try {
            const provinces = await listOfProvincesService.getListOfProvinces();
            return res.status(200).json(provinces);
        } catch (error) {
            next(error);
        }
    }

    async getListExperienceLocationsByProvince(req, res, next) {
        try {
            const provinceCode = req.params.provinceCode;
            const experienceLocations =
                await listOfExperienceLocationService.getListExperienceLocationsByProvince(
                    provinceCode
                );
            return res.status(200).json(experienceLocations);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProvincesController();
