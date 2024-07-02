const mongoose = require("mongoose");

const ExperienceLocationSchema = new mongoose.Schema({
    locationId: { type: String, required: true },
    locationName: { type: String, required: true },
    thumbnailUrl: { type: String },
    detailedPageUrl: { type: String, required: true },
    address: { type: String, required: true },
    price: {
        originalPrice: {
            type: String,
            required: true,
        },
        discountedPrice: {
            type: String,
            required: true,
        },
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Province",
        required: true,
    },
    isEditByAdmin: { type: Boolean, default: false },
});

const ExperienceLocation = mongoose.model(
    "ExperienceLocation",
    ExperienceLocationSchema
);

module.exports = ExperienceLocation;
