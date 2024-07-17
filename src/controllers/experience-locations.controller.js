const listOfExperienceLocationService = require("../services/experience-location/list-of-experience-locations.service.js");
const experienceLocationsDetailSerivice = require("../services/experience-location/experience-location-detail.service.js");

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

    async getExperienceLocationsById(req, res, next) {
        try {
            const experienceLocationId = req.params.id;
            console.log("experienceLocationId", experienceLocationId);
            const experienceLocation = await experienceLocationsDetailSerivice.getExperienceLocationsById(experienceLocationId);
            return res.status(200).json(experienceLocation);
        } catch (error) {
            next(error);
        }
    }

    async createExperienceLocation(req, res, next) {
        try {
            const locationData = req.body;
            const newExperienceLocation = await experienceLocationsDetailSerivice.createExperienceLocation(locationData);
            console.log("newExperienceLocation", newExperienceLocation);
            return res.status(201).json(newExperienceLocation);
        } catch (error) {
            next(error);
        }
    }

    async updateExperienceLocationById(req, res, next) {
        try {
            const locationId = req.params.id;
            const updateData = req.body;
            const updatedLocation = await experienceLocationsDetailSerivice.updateExperienceLocationById(locationId, updateData);
            return res.status(200).json(updatedLocation);
        } catch (error) {
            next(error);
        }
    }

    async deleteExperienceLocationById(req, res, next) {
        try {
            const locationId = req.params.id;
            const result = await experienceLocationsDetailSerivice.deleteExperienceLocationById(locationId);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ExperienceLocationController();
