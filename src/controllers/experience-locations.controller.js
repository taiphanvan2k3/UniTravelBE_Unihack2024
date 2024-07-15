const listOfExperienceLocationService = require("../services/experience-location/list-of-experience-locations.service.js");

class ExperienceLocationController {
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

    async getTopExperienceLocations(req, res, next) {
        try {
            const limit = Number(req.query.limit) || 10;
            const experienceLocations =
                await listOfExperienceLocationService.getTopExperienceLocations(
                    limit
                );
            return res.status(200).json(experienceLocations);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ExperienceLocationController();
