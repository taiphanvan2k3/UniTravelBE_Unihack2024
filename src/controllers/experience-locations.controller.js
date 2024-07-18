const listOfExperienceLocationService = require("../services/experience-location/list-of-experience-locations.service.js");
const experienceLocationsDetailService = require("../services/experience-location/experience-location-detail.service.js");
const postDetailService = require("../services/post/post-detail.service.js");

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

    async createNewPost(req, res, next) {
        try {
            const experienceLocationId = req.params.id;
            const { content } = req.body;
            const { images, videos } = req.files;
            const newPost = await postDetailService.createNewPost(
                experienceLocationId,
                {
                    content,
                    images,
                    videos,
                }
            );

            res.status(201).json({
                data: newPost,
                hasUploadMedia: images?.length > 0 || videos?.length > 0,
            });
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
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
}

module.exports = new ExperienceLocationController();
