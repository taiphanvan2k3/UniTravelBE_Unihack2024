const ExperienceLocation = require("../../models/experience-location.model");
const { logInfo, logError } = require("../logger.service.js");

const getExperienceLocationsById = async (experienceLocationId) => {
    try {
        logInfo("getExperienceLocationsById", "Start");
        const experienceLocation = await ExperienceLocation.findById(
            experienceLocationId,
            "-__v"
        );

        logInfo("getExperienceLocationsById", "End");
        return experienceLocation;
    } catch (error) {
        logError("getListExperienceLocationsByProvince", error.message);
        throw error;
    }
};

const getPostsInExperienceLocation = async (
    experienceLocationId,
    pageIndex,
    pageSize
) => {};

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
