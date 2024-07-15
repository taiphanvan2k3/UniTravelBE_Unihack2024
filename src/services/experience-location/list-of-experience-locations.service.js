const ExperienceLocation = require("../../models/experience-location.model");
const { logInfo, logError } = require("../logger.service.js");

const getListExperienceLocationsByProvince = async (provinceCode) => {
    try {
        logInfo("getListExperienceLocationsByProvince", "Start");
        const experienceLocations = (
            await ExperienceLocation.find({
                provinceCode,
            })
        ).map((location) => {
            const res = location.toObject();
            delete res.province;
            delete res.provinceCode;
            return res;
        });

        logInfo("getListExperienceLocationsByProvince", "End");
        return experienceLocations;
    } catch (error) {
        logError("getListExperienceLocationsByProvince", error.message);
        throw error;
    }
};

const getTopExperienceLocations = async (limit) => {
    try {
        logInfo("getTopExperienceLocations", "Start");
        const experienceLocations = (
            await ExperienceLocation.find({
                score: { $gt: 8.5 },
            })
                .sort({ crawledTotalReview: -1 })
                .limit(limit)
        ).map((location) => {
            const res = location.toObject();
            delete res.province;
            delete res.provinceCode;
            return res;
        });

        logInfo("getTopExperienceLocations", "End");
        return experienceLocations;
    } catch (error) {
        logError("getTopExperienceLocations", error.message);
        throw error;
    }
};

module.exports = {
    getListExperienceLocationsByProvince,
    getTopExperienceLocations,
};
