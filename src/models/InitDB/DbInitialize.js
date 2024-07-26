const seedProvinces = require("./province-DbInitialize.js");
const seedVouchers = require("./voucher-DbInitialize.js");
const seedBadges = require("./badge-DbInitialize.js");
const { logInfo, logError } = require("../../services/logger.service.js");

const seedData = async function () {
    try {
        logInfo("seedData", "Seeding data");
        const tasks = [seedProvinces(), seedVouchers(), seedBadges()];
        await Promise.all(tasks);
        logInfo("seedData", "Seeding data successfully");
    } catch (error) {
        logError("seedData", error);
    }
};

module.exports = seedData;
