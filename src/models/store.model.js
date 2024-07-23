const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    province: { type: mongoose.Schema.Types.ObjectId, ref: "Province" },
    detailAddress: { type: String, required: true },
    openingHours: { type: String, required: true }, // Ví dụ: "Mở | Thứ, 15:00-22:00"
    thumbnailUrl: { type: String },

    // Ví dụ: "Nhà hàng", "Cửa hàng tiện lợi", "Cà phê"
    businessType: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    qrCodeUrl: { type: String },
});

StoreSchema.index({ owner: 1, businessType: 1 });
StoreSchema.index({ province: 1, businessType: 1 });

const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;
