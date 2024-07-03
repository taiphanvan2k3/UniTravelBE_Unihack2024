const seedProvinces = require("./province-DbInitialize");

const seedData = async function () {
    try {
        await seedProvinces();
    } catch (error) {
        console.log(`Error at ${__filename} with error: ${error.message}`);
    }
};

module.exports = seedData;
