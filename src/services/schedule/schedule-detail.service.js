const { logInfo, logError } = require("../logger.service.js");
const mongoose = require('mongoose');

const Schedule = require("../../models/schedule.model");

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

const createSchedule = async (scheduleData) => {
    try {
        logInfo("createSchedule", "Start");

        // Validate ObjectId fields if provided
        if (scheduleData.type === 'location' && !isValidObjectId(scheduleData.location)) {
            throw new Error("Invalid location ID");
        }
        if (scheduleData.type === 'province' && !isValidObjectId(scheduleData.province)) {
            throw new Error("Invalid province ID");
        }

        const schedule = new Schedule({
            ...scheduleData,
            location: scheduleData.type === 'location' ? scheduleData.location : undefined,
            province: scheduleData.type === 'province' ? scheduleData.province : undefined,
        });
        await schedule.save();

        logInfo("createSchedule", "End");
        return schedule;
    } catch (error) {
        logError("createSchedule", error.message);
        throw new Error("createSchedule: " + error.message);
    }
};

const getScheduleById = async (id) => {
    try {
        logInfo("getScheduleById", "Start");
        const schedule = await Schedule.findById(id).populate('location').populate('province');
        if (!schedule) {
            throw new Error("Schedule not found");
        }
        logInfo("getScheduleById", "End");
        return schedule;
    } catch (error) {
        logError("getScheduleById", error.message);
        throw new Error("getScheduleById: " + error.message);
    }
};

const updateScheduleById = async (id, updateData) => {
    try {
        logInfo("updateScheduleById", "Start");
        // Handle changes to type-specific fields
        if (updateData.type === 'location' && !isValidObjectId(updateData.location)) {
            throw new Error("Invalid location ID");
        }
        if (updateData.type === 'province' && !isValidObjectId(updateData.province)) {
            throw new Error("Invalid province ID");
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(id, {
            ...updateData,
            location: updateData.type === 'location' ? updateData.location : undefined,
            province: updateData.type === 'province' ? updateData.province : undefined,
        }, { new: true });

        logInfo("updateScheduleById", "End");
        return updatedSchedule;
    } catch (error) {
        logError("updateScheduleById", error.message);
        throw new Error("updateScheduleById: " + error.message);
    }
};

const deleteScheduleById = async (id) => {
    try {
        logInfo("deleteScheduleById", "Start");
        await Schedule.findByIdAndDelete(id);
        logInfo("deleteScheduleById", "End");
        return { message: "Schedule deleted successfully" };
    } catch (error) {
        logError("deleteScheduleById", error.message);
        throw new Error("deleteScheduleById: " + error.message);
    }
};

module.exports = {
    createSchedule,
    getScheduleById,
    updateScheduleById,
    deleteScheduleById,
};
