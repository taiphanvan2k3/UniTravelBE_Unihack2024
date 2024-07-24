const seedProvinces = require("./province-DbInitialize.js");
const seedVouchers = require("./voucher-DbInitialize.js");
const { logInfo, logError } = require("../../services/logger.service.js");

const seedData = async function () {
    try {
        logInfo("seedData", "Seeding data");
        const tasks = [seedProvinces(), seedVouchers()];
        await Promise.all(tasks);
        logInfo("seedData", "Seeding data successfully");
    } catch (error) {
        logError("seedData", error);
    }
};

module.exports = seedData;
