const { logInfo, logError } = require("../logger.service.js");
const Schedule = require("../../models/schedule.model.js");

const getListOfSchedule = async () => {
    try {
        logInfo("getListOfSchedule", "Start");
        const schedules = await Schedule.find();

        logInfo("getListOfSchedule", "End");
        return schedules;
    } catch (error) {
        logError("getListOfSchedule", error.message);
        throw new Error("getListOfSchedule: " + error.message);
    }
};

const getListOfScheduleByProvince = async (provinceId) => {
    try {
        logInfo("getListOfScheduleByProvince", "Start");
        const schedules = await Schedule.find({ province: provinceId });

        logInfo("getListOfScheduleByProvince", "End");
        return schedules;
    } catch (error) {
        logError("getListOfScheduleByProvince", error.message);
        throw new Error("getListOfScheduleByProvince: " + error.message);
    }
};

const getListOfScheduleByLocation = async (locationId) => {
    try {
        logInfo("getListOfScheduleByLocation", "Start");
        const schedules = await Schedule.find({ location: locationId });

        logInfo("getListOfScheduleByLocation", "End");
        return schedules;
    } catch (error) {
        logError("getListOfScheduleByLocation", error.message);
        throw new Error("getListOfScheduleByLocation: " + error.message);
    }
};

module.exports = {
    getListOfSchedule,
    getListOfScheduleByProvince,
    getListOfScheduleByLocation
};
