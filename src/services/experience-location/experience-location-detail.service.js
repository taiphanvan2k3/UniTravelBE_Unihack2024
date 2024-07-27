const { logInfo, logError } = require("../logger.service.js");
const { getPostsInLocation } = require("../post/list-posts.service");
const { calculateDistance } = require("../../helpers/utils.js");

const User = require("../../models/user.model");
const ExperienceLocation = require("../../models/experience-location.model");
const CheckInHistory = require("../../models/checkin-history.model");

const getExperienceLocationsById = async (userId, experienceLocationId) => {
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
            experienceLocationData.posts = await getPostsInLocation(
                experienceLocation._id,
                "experienceLocation",
                pageIndex,
                pageSize
            );
            experienceLocationData.pageIndex = pageIndex;
        }

        if (userId) {
            const checkInHistory = await CheckInHistory.findOne({
                user: userId,
                experienceLocation: experienceLocationId,
            });
            experienceLocationData.isCheckIn = !!checkInHistory;
        } else {
            experienceLocationData.isCheckIn = false;
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

const checkInExperienceLocation = async (
    experienceId,
    userId,
    longitude,
    latitude
) => {
    try {
        logInfo("checkInExperienceLocation", "Start");
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            throw new Error("404-User not found");
        }

        const experienceLocation = await ExperienceLocation.findById(
            experienceId
        );
        if (!experienceLocation) {
            throw new Error("404-Experience location is not found");
        }

        // Kiểm tra về khoảng cách
        const distance = calculateDistance(
            Number(experienceLocation.latitude),
            Number(experienceLocation.longitude),
            latitude,
            longitude
        );

        if (distance > 50) {
            throw new Error("401-You are too far from the experience location");
        }

        let checkInHistory = await CheckInHistory.findOne({
            user: currentUser._id,
            experienceLocation: experienceLocation._id,
        });

        if (!checkInHistory) {
            checkInHistory = new CheckInHistory({
                user: currentUser._id,
                experienceLocation: experienceLocation._id,
            });
        } else {
            checkInHistory.lastCheckIn = Date.now();
        }

        await checkInHistory.save();
        logInfo("checkInExperienceLocation", "End");
    } catch (error) {
        logError("checkInExperienceLocation", error.message);
        throw error;
    }
};

module.exports = {
    getExperienceLocationsById,
    createExperienceLocation,
    updateExperienceLocationById,
    deleteExperienceLocationById,
    checkInExperienceLocation,
};
