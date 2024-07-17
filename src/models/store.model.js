const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    openingHours: { type: String, required: true }, // Ví dụ: "Mở | Thứ, 15:00-22:00"
    thumbnailUrl: { type: String },
    businessType: { type: String, required: true },
    creator: { type: String, required: true },
    foundedDate: { type: Date, default: Date.now }
});

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
