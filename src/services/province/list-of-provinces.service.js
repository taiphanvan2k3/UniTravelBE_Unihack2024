const Provinces = require("../../models/province.model.js");
const { logInfo, logError } = require("../logger.service.js");

const getListOfProvinces = async () => {
    try {
        logInfo("getListOfProvinces", "Start");
        const provinces = (await Provinces.find()).map((province) =>
            province.toObject()
        );
        logInfo("getListOfProvinces", "End");
        return provinces;
    } catch (error) {
        logError("getListOfProvinces", error.message);
        throw error;
    }
};

module.exports = {
    getListOfProvinces,
};
