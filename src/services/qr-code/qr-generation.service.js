const { logInfo, logError } = require("../logger.service");
const qr = require("qr-image");
const jsQR = require("jsqr");
const Jimp = require("jimp");
const path = require("path");
const logoPath = path.join(__dirname, "./images/logo.png");

async function generateQRCodeWithLogo(storeInfo, outputFilePath) {
    try {
        logInfo("generateQRCodeWithLogo", "Start");
        const qrBuffer = qr.imageSync(JSON.stringify(storeInfo), {
            type: "png",
            size: 10,
        });

        // // Đọc mã QR và logo bằng Jimp
        const qrImage = await Jimp.read(qrBuffer);
        const logo = await Jimp.read(logoPath);

        // // Thay đổi kích thước logo để phù hợp với mã QR
        const qrSize = qrImage.bitmap.width;
        const logoSize = qrSize / 6;
        logo.resize(logoSize, logoSize);

        const x = (qrSize - logoSize) / 2;
        const y = (qrSize - logoSize) / 2;

        // // Chèn logo vào mã QR
        qrImage.composite(logo, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 1,
            opacityDest: 1,
        });

        outputFilePath = path.join(__dirname, outputFilePath);
        await qrImage.writeAsync(outputFilePath);

        logInfo("generateQRCodeWithLogo", `QR code saved to ${outputFilePath}`);
        return outputFilePath;
    } catch (err) {
        logError("generateQRCodeWithLogo", err.message);
        throw new Error("generateQRCodeWithLogo: " + err.message);
    }
}

async function decodeQRCode(imagePath) {
    try {
        logInfo("decodeQRCode", "Start");
        const image = await Jimp.read(imagePath);
        const { bitmap } = image;
        const imageData = {
            data: bitmap.data,
            width: bitmap.width,
            height: bitmap.height,
        };

        // Tạo đối tượng ImageData để jsQR
        const qrImageData = {
            data: new Uint8ClampedArray(imageData.data),
            width: imageData.width,
            height: imageData.height,
        };

        // Giải mã QR Code từ ImageData
        const qrCode = jsQR(
            qrImageData.data,
            qrImageData.width,
            qrImageData.height
        );

        if (qrCode) {
            logInfo("decodeQRCode", "Successfully decode");
            return JSON.parse(qrCode.data);
        } else {
            console.log("No QR code found.");
            return null;
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

module.exports = {
    generateQRCodeWithLogo,
    decodeQRCode,
};
