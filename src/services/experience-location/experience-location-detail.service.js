const ExperienceLocation = require("../../models/experience-location.model");
const { logInfo, logError } = require("../logger.service.js");

const getExperienceLocationsById = async (experienceLocationId) => {
    try {
        logInfo("getExperienceLocationsById", "Start");
        const experienceLocation = await ExperienceLocation.findById(experienceLocationId, '-__v');

        logInfo("getExperienceLocationsById", "End");
        return experienceLocation;
    } catch (error) {
        logError("getListExperienceLocationsByProvince", error.message);
        throw error;
    }
};

module.exports = {
    getExperienceLocationsById,
};
