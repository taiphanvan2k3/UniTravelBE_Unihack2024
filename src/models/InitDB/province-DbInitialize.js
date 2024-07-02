const Province = require("../../models/province.model.js");

const seedProvinces = async () => {
    try {
        // Kiểm tra xem tồn tại dữ liệu trong bảng Province không
        const provincesFromDB = await Province.find();
        if (provincesFromDB.length > 0) {
            console.log("Provinces collection already exists");
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
    } catch (error) {
        console.log(`Error at ${__filename} with error: ${error.message}`);
    }
};

module.exports = seedProvinces;
