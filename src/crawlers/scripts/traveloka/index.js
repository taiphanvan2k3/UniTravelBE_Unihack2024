const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "../../../../.env");
dotenv.config({ path: envPath });
const dataPath = path.join(__dirname, "../../results/traveloka/locations");

const Province = require("../../../models/province.model.js");
const ExperienceLocation = require("../../../models/experience-location.model.js");

const saveExperienceLocations = async (filePath) => {
    try {
        const data = require(filePath);
        const province = await Province.findOne({ name: data.provinceName });
        if (province?._id) {
            const experienceLocations = data.experienceLocations.map(
                (location) => {
                    return new ExperienceLocation({
                        locationId: location.locationId,
                        locationName: location.locationName,
                        thumbnailUrl: location.thumbnailUrl,
                        detailedPageUrl: location.detailedPageUrl,
                        address: location.address,
                        price: {
                            originalPrice: location.price.originalPrice,
                            discountedPrice: location.price.discountedPrice,
                        },
                        provinceCode: province.code,
                        province: province._id,
                        score: location.score ?? 0,
                        crawledTotalReview: location.totalReview ?? 0,
                        actualTotalReview: 0,
                    });
                }
            );

            const promises = experienceLocations.map((location) => {
                // Cần xoá _id vì nếu không sẽ bị lỗi khi insert vào db
                delete location._doc._id;
                return ExperienceLocation.findOneAndUpdate(
                    { locationId: location.locationId, isEditByAdmin: false },
                    location,
                    { upsert: true, new: true }
                );
            });
            await Promise.all(promises);

            console.log(
                "Successfully processed data for province:",
                data.provinceName
            );
        } else {
            console.log("Province not found", data.provinceName);
            return;
        }
    } catch (err) {
        console.error("Error reading file", err);
    }
};

const saveCrawledData = function () {
    // Hiển thị danh sách file trong thư mục
    const fs = require("fs");
    fs.readdir(dataPath, (err, files) => {
        if (!err) {
            files.forEach((file) => {
                const filePath = path.join(dataPath, file);
                saveExperienceLocations(filePath);
            });
        } else {
            console.error("Error reading directory", err);
        }
    });
};

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        saveCrawledData();
    })
    .catch((err) => console.log(err));
