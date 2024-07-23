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

const getProvinceNameByCode = async (provinceCode) => {
    try {
        logInfo("getProvinceNameByCode", "Start");
        const province = await Provinces.findOne({ code: provinceCode });
        if(province === null) {
            logError("getProvinceNameByCode", "No province found with code: " + provinceCode);
            throw new Error("Province not found");
        }

        logInfo("getProvinceNameByCode", "End");
        return province.name;
    } catch (error) {
        logError("getProvinceNameByCode", error.message);
        throw error
    }
}

module.exports = {
    getListOfProvinces,
    getProvinceNameByCode
};
