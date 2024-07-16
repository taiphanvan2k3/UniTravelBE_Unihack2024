const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

// Đường dẫn đến file .env và thư mục chứa dữ liệu JSON
const envPath = path.resolve(__dirname, "../../../../.env");
dotenv.config({ path: envPath });
const dataPath = path.join(__dirname, "../../results/travelokadetails");

// Import model MongoDB
const ExperienceLocation = require("../../../models/experience-location.model.js");

// Hàm để lưu các ExperienceLocation từ file JSON vào MongoDB
const saveExperienceLocations = async (filePath) => {
    try {
        const data = require(filePath);
        const locationId = path.basename(filePath, '.json');
        const existingLocation = await ExperienceLocation.findOne({ locationId, isEditByAdmin: false });

        if (existingLocation) {
            existingLocation.address = data.address;
            existingLocation.time = data.time;
            existingLocation.description = data.content;
            existingLocation.reviews = data.reviews;

            await existingLocation.save();

            console.log("Updated location:", locationId);
        } else {
            console.log("Location not found or edited by admin:", locationId);
        }
    } catch (err) {
        console.error("Error reading file", err);
    }
};

// Hàm duyệt qua tất cả các file JSON trong thư mục
const saveCrawledData = function () {
    fs.readdir(dataPath, (err, folders) => {
        if (!err) {
            folders.forEach((folder) => {
                const folderPath = path.join(dataPath, folder);
                fs.readdir(folderPath, (err, files) => {
                    if (!err) {
                        files.forEach((file) => {
                            const filePath = path.join(folderPath, file);
                            saveExperienceLocations(filePath);
                        });
                    } else {
                        console.error("Error reading subdirectory", err);
                    }
                });
            });
        } else {
            console.error("Error reading directory", err);
        }
    });
};

// Kết nối đến MongoDB và chạy hàm saveCrawledData
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        saveCrawledData();
    })
    .catch((err) => console.log(err));
