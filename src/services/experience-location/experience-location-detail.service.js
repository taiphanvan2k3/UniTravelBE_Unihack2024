const { logInfo, logError } = require("../logger.service.js");
const { getPostsInLocation } = require("../post/list-posts.service");

const ExperienceLocation = require("../../models/experience-location.model");

const getExperienceLocationsById = async (experienceLocationId) => {
    try {
        logInfo("getExperienceLocationsById", "Start");
        const experienceLocation = await ExperienceLocation.findById(
            experienceLocationId,
            "-__v"
        );

        const experienceLocationData = experienceLocation.toObject();
        if (experienceLocation) {
            const pageIndex = 1;
            const pageSize = 10;
            experienceLocationData.comments = await getPostsInLocation(
                experienceLocation._id,
                "experienceLocation",
                pageIndex,
                pageSize
            );
            experienceLocationData.pageIndex = pageIndex;
        }

        logInfo("getExperienceLocationsById", "End");
        return experienceLocationData;
    } catch (error) {
        logError("getListExperienceLocationsByProvince", error.message);
        throw error;
    }
};

const createExperienceLocation = async (locationData) => {
    try {
        logInfo("createExperienceLocation", "Start");
        const newExperienceLocation = new ExperienceLocation(locationData);
        await newExperienceLocation.save();

        logInfo("createExperienceLocation", "End");
        return newExperienceLocation;
    } catch (error) {
        logError("createExperienceLocation", error.message);
        throw error;
    }
};

const updateExperienceLocationById = async (id, locationData) => {
    try {
        logInfo("updateExperienceLocationById", "Start");
        const updatedExperienceLocation =
            await ExperienceLocation.findByIdAndUpdate(id, locationData, {
                new: true,
            });

        logInfo("updateExperienceLocationById", "End");
        return updatedExperienceLocation;
    } catch (error) {
        logError("updateExperienceLocationById", error.message);
        throw error;
    }
};

const deleteExperienceLocationById = async (id) => {
    try {
        logInfo("deleteExperienceLocationById ", "Start");
        const deletedExperienceLocation =
            await ExperienceLocation.findByIdAndDelete(id);

        logInfo("deleteExperienceLocationById ", "End");
        return deletedExperienceLocation;
    } catch (error) {
        logError("deleteExperienceLocationById ", error.message);
        throw error;
    }
};

module.exports = {
    getExperienceLocationsById,
    createExperienceLocation,
    updateExperienceLocationById,
    deleteExperienceLocationById,
};
