const mongoose = require("mongoose");

const ExperienceLocationSchema = new mongoose.Schema(
    {
        locationId: { type: String, required: true },
        locationName: { type: String, required: true },
        thumbnailUrl: { type: String },
        detailedPageUrl: { type: String, required: true },
        address: { type: String, required: true },
        time: { type: String },
        description: { type: String },
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
        provinceCode: { type: String, required: true },
        province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Province",
            required: true,
        },
        score: { type: Number, default: 0 },
        crawledTotalReview: { type: Number, default: 0 },
        actualTotalReview: { type: Number, default: 0 },
        isEditByAdmin: { type: Boolean, default: false },
        longitude: { type: Number },
        latitude: { type: Number },
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ExperienceLocationSchema.set("toObject", {
    transform: function (_, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        delete ret.reviews;
        delete ret.detailedPageUrl;
        delete ret.locationId;
        return ret;
    },
});

ExperienceLocationSchema.set("toJSON", {
    transform: function (_, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        delete ret.reviews;
        delete ret.detailedPageUrl;
        delete ret.locationId;
        return ret;
    },
});

const ExperienceLocation = mongoose.model(
    "ExperienceLocation",
    ExperienceLocationSchema
);

module.exports = ExperienceLocation;
