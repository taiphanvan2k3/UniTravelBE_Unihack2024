const { logInfo, logError } = require("./logger.service.js");
const { admin } = require("../config/firebase");
const fs = require("fs");
const path = require("path");

const db = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * Thực hiện công việc upload một file lên FileStorage thông qua file object của nó
 * @param {Object} file: file object gồm các trường originalname, mimetype, buffer
 * @param {String} bucketName : tên của bucket muốn lưu file
 * @returns
 */
const uploadFileToStorage = async (file, bucketName) => {
    return new Promise((resolve, reject) => {
        try {
            const fileName = `${bucketName}/${file.originalName}`;
            logInfo("uploadFileToStorage", `Start uploading file ${fileName}`);
            const fileUpload = bucket.file(fileName);

            const blobStream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            blobStream.on("error", (error) => {
                console.error("Error uploading file:", error);
                reject(new Error(error));
            });

            blobStream.on("finish", async () => {
                const publicUrl = await getPublicUrl(
                    bucketName,
                    file.originalName
                );

                logInfo(
                    "uploadFileToStorage",
                    `File uploaded successfully: ${publicUrl}`
                );
                resolve(publicUrl);
            });

            // Ghi dữ liệu file vào storage, và các sự kiện error, finish sẽ được gọi khi có lỗi hoặc khi ghi file thành công
            blobStream.end(file.buffer);
        } catch (error) {
            logError("uploadFileToStorage", `Error uploading file: ${error}`);
            reject(new Error(error));
        }
    });
};

const getPublicUrl = async (bucketName, fileName) => {
    const file = bucket.file(`${bucketName}/${fileName}`);

    const signedUrls = await file.getSignedUrl({
        action: "read",
        expires: "01-01-2100",
    });

    return signedUrls[0];
};

/**
 * Lưu một file lên FileStorage thông qua đường dẫn của nó trong thư mục của project
 * @param {String} filePath : đường dẫn file cần upload nằm trong thư mục của project
 * @param {String} bucketName: tên của bucket muốn lưu file
 * @returns {Promise<String>} : trả về URL public của file sau khi upload
 */
const uploadFileFromFilePath = async (filePath, bucketName) => {
    try {
        const originalName = path.basename(filePath);

        const { default: mime } = await import("mime");
        const mimeType = mime.getType(filePath);

        const fileContent = fs.readFileSync(filePath);
        const file = {
            originalName,
            contentType: mimeType,
            buffer: fileContent,
        };

        return await uploadFileToStorage(file, bucketName);
    } catch (error) {
        console.log("uploadFileFromFilePath:", error);
        throw new Error(error);
    }
};

module.exports = { db, admin, uploadFileToStorage, uploadFileFromFilePath };
