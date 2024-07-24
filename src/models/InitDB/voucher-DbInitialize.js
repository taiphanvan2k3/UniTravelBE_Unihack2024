const { logInfo, logError } = require("../../services/logger.service.js");
const Voucher = require("../../models/voucher.model");

const seedVouchers = async () => {
    try {
        // Kiểm tra xem có voucher nào trong hệ thống chưa
        const vouchers = await Voucher.find();
        if (vouchers.length > 0) {
            logInfo("seedVouchers", "Voucher already initialized");
            return;
        }

        // Khởi tạo danh sách voucher
        const voucherData = [
            {
                code: "5% off",
                discount: 5,
                description: "5% discount",
            },
            {
                code: "10% off",
                discount: 10,
                description: "10% discount",
            },
            {
                code: "15% off",
                discount: 15,
                description: "15% discount",
            },
            {
                code: "20% off",
                discount: 20,
                description: "20% discount",
            },
        ];

        await Voucher.insertMany(voucherData);
        logInfo("seedVouchers", "Voucher initialized");
    } catch (error) {
        logError("seedVouchers", error);
    }
};

module.exports = seedVouchers;
