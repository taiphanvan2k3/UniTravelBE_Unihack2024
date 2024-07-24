const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Province",
            required: true,
        },
        detailAddress: { type: String, required: true },
        addressOnMap: {
            type: { type: String, enum: ["Point"], required: true },
            coordinates: { type: [Number], required: true },
        },
        openingHours: { type: String, required: true }, // Ví dụ: "Mở | Thứ, 15:00-22:00"
        thumbnailUrl: { type: String },
        imageUrls: { type: [String] },
        videoUrls: { type: [String] },

        // Ví dụ: "food store", "coffee"
        businessType: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
        qrCodeUrl: { type: String },
    },
    {
        versionKey: false, // Đảm bảo `_v` không được thêm vào
    }
);

StoreSchema.index({ addressOnMap: "2dsphere" });
StoreSchema.index({ owner: 1, businessType: 1 });
StoreSchema.index({ province: 1, businessType: 1 });

const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;
