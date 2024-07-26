const listOfExperienceLocationService = require("../services/experience-location/list-of-experience-locations.service.js");
const experienceLocationsDetailService = require("../services/experience-location/experience-location-detail.service.js");
const listPostsService = require("../services/post/list-posts.service.js");

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

    async getPostsInExperienceLocation(req, res, next) {
        try {
            const experienceLocationId = req.params.id;
            const pageIndex = Number(req.query.pageIndex) || 0;
            const pageSize = Number(req.query.pageSize) || 10;
            const posts = await listPostsService.getPostsInLocation(
                experienceLocationId,
                "experienceLocation",
                pageIndex,
                pageSize
            );
            return res.status(200).json(posts);
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
            const experienceLocation =
                await experienceLocationsDetailService.getExperienceLocationsById(
                    experienceLocationId
                );

            if (!experienceLocation) {
                return res.status(404).json({
                    message: "Experience location not found",
                });
            }
            return res.status(200).json(experienceLocation);
        } catch (error) {
            next(error);
        }
    }

    async createExperienceLocation(req, res, next) {
        try {
            const locationData = req.body;
            const newExperienceLocation =
                await experienceLocationsDetailService.createExperienceLocation(
                    locationData
                );
            return res.status(201).json(newExperienceLocation);
        } catch (error) {
            next(error);
        }
    }

    async updateExperienceLocationById(req, res, next) {
        try {
            const locationId = req.params.id;
            const updateData = req.body;
            const updatedLocation =
                await experienceLocationsDetailService.updateExperienceLocationById(
                    locationId,
                    updateData
                );

            if (!updatedLocation) {
                return res.status(404).json({
                    message: "Experience location not found",
                });
            }
            return res.status(200).json(updatedLocation);
        } catch (error) {
            next(error);
        }
    }

    async deleteExperienceLocationById(req, res, next) {
        try {
            const locationId = req.params.id;
            const result =
                await experienceLocationsDetailService.deleteExperienceLocationById(
                    locationId
                );

            if (!result) {
                return res.status(404).json({
                    message: "Experience location not found",
                });
            }
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async checkIn(req, res, next) {
        try {
            const { id } = req.params;
            let { userId, longitude, latitude } = req.body;
            if (!longitude || !latitude) {
                return res.status(400).json({
                    message: "Longitude and Latitude are required",
                });
            }
            longitude = Number(longitude);
            latitude = Number(latitude);

            await experienceLocationsDetailService.checkInExperienceLocation(
                id,
                userId,
                longitude,
                latitude
            );
            return res.status(200).json({ message: "Check in successfully" });
        } catch (error) {
            if (error.message.includes("-")) {
                const [statusCode, message] = error.message.split("-");
                return res.status(statusCode).json({
                    message,
                });
            }
            next(error);
        }
    }
}

module.exports = new ExperienceLocationController();
