const Province = require("../../models/province.model.js");
const { logInfo, logError } = require("../../services/logger.service.js");

const seedProvinces = async () => {
    try {
        // Kiểm tra xem tồn tại dữ liệu trong bảng Province không
        const provincesFromDB = await Province.find();
        if (provincesFromDB.length > 0) {
            logInfo("seedProvinces", "Province already initialized");
            return;
        }

        // Đọc dữ liệu từ file json
        const { Provinces: provinces } = require("./data/provinces.json");
        const provincesObj = provinces.map((province) => {
            return new Province({
                code: province.Code,
                name: province.Name,
            });
        });

        await Province.insertMany(provincesObj);
        logInfo("seedProvinces", "Provinces are successfully initialized");
    } catch (error) {
        logError("seedProvinces", error);
    }
};

module.exports = seedProvinces;
