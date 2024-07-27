const fs = require("fs");

const createFolderIfNotExist = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

/**
 * Tính khoảng cách giữa hai điểm trên mặt cầu (khoảng cách Haversine)
 * @param {number} lat1 - Vĩ độ của điểm đầu
 * @param {number} lon1 - Kinh độ của điểm đầu
 * @param {number} lat2 - Vĩ độ của điểm cuối
 * @param {number} lon2 - Kinh độ của điểm cuối
 * @returns {number} Khoảng cách giữa hai điểm (đơn vị: km)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const lat1Rad = (lat1 * Math.PI) / 180; // φ, λ in radians
    const lat2Rad = (lat2 * Math.PI) / 180;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in metres
    return distance;
};

const deleteAllUploadedFiles = (...files) => {
    files.forEach((element) => {
        if (element) {
            if (Array.isArray(element)) {
                element.forEach((f) => {
                    fs.unlink(f.path, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
                return;
            }
            fs.unlink(element.path, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
};

const getCurrentDateTimeFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};
module.exports = {
    createFolderIfNotExist,
    calculateDistance,
    deleteAllUploadedFiles,
    getCurrentDateTimeFormatted,
};
