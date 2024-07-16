const path = require("path");
const fs = require('fs');
const { createFolderIfNotExist } = require("../../../helpers/utils.js");
const { crawlDataPageDetail } = require("./base-crawl.js");

const extractImportantFields = (data) => {
    // Truy cập vào mảng các reviews trong dữ liệu
    let reviews = data.userReviews?.reviews || [];

    // Giới hạn số lượng reviews lấy được tối đa là 100
    reviews = reviews.slice(0, 100);

    // Trích xuất các trường cần thiết từ mỗi review
    return {
        reviews: reviews.map((review) => {
            return {
                reviewerName: review.reviewerName,
                timestamp: review.timestamp,
                reviewText: review.reviewText,
                score: review.score,
                language: review.language,
                reviewPhotos: review.reviewPhotos.map(photo => ({
                    photoUrl: photo.photoUrl,
                    date: photo.date
                }))
            };
        })
    };
};

// Định nghĩa đường dẫn tới các thư mục
// const locationsDir = path.join(__dirname, '/../../results/traveloka/locations');
// const detailsDir = path.join(__dirname, '/../../results/travelokadetails');

// // Hàm để tạo thư mục nếu nó chưa tồn tại
// const ensureDirExists = (dirPath) => {
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true });
//     }
// };

// // Đọc và xử lý từng file JSON trong thư mục locations
// fs.readdir(locationsDir, (err, files) => {
//     if (err) {
//         console.log('Unable to scan directory: ' + err);
//         return;
//     }
//     files.forEach(file => {
//         if (path.extname(file) === '.json') {
//             const filePath = path.join(locationsDir, file);
//             fs.readFile(filePath, 'utf8', async (err, data) => {
//                 if (err) {
//                     console.log(`Error reading file from disk: ${err}`);
//                 } else {
//                     const jsonData = JSON.parse(data);
//                     const detailFolder = path.join(detailsDir, path.basename(file, '.json'));
//                     ensureDirExists(detailFolder); // Tạo thư mục cho từng file JSON

//                     // Duyệt qua từng experienceLocation trong jsonData
//                     for (const location of jsonData.experienceLocations) {
//                         const detailedPageUrl = location.detailedPageUrl;
//                         const targetResponseUrl = "https://www.traveloka.com/api/v2/experience/reviews"; // Cập nhật URL phù hợp
//                         const outputFilePath = path.join(detailFolder, `${location.locationId}.json`);

//                         // Gọi hàm crawl và lưu kết quả
//                         await crawlDataPageDetail(
//                             detailedPageUrl,
//                             targetResponseUrl,
//                             outputFilePath,
//                             extractImportantFields
//                         );
//                     }
//                 }
//             });
//         }
//     });
// });

// CRAWL ĐƠN LẺ

const pageUrl =
    "https://www.traveloka.com/vi-vn/activities/vietnam/product/ozo-park-ticket-in-quang-binh-7426006085323";
const targetResponseUrl =
    "https://www.traveloka.com/api/v2/experience/reviews";

const fileOutputPath = path.join(
    __dirname,
    "/../../results/travelokadetails/QuangBinh",
    "traveloka_7426006085323.json"
);

createFolderIfNotExist(path.dirname(fileOutputPath));

(async () => {
    await crawlDataPageDetail(
        pageUrl,
        targetResponseUrl,
        fileOutputPath,
        extractImportantFields
    );
})();
