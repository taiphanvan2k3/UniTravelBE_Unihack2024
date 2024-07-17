const mongoose = require("mongoose");

const ReviewPhotoSchema = new mongoose.Schema({
    photoUrl: String,
    date: {
        month: String,
        day: String,
        year: String,
    },
});

const ReviewSchema = new mongoose.Schema({
    reviewerName: String,
    timestamp: String,
    reviewText: String,
    score: String,
    language: String,
    reviewPhotos: [ReviewPhotoSchema],
});

const ExperienceLocationSchema = new mongoose.Schema(
    {
        locationId: { type: String, required: true },
        locationName: { type: String, required: true },
        thumbnailUrl: { type: String },
        detailedPageUrl: { type: String, required: true },
        address: { type: String, required: true },
        time: { type: String },
        description: { type: String },
        reviews: [ReviewSchema],
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
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ExperienceLocationSchema.set("toObject", {
    transform: function (_, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        return ret;
    },
});

ExperienceLocationSchema.set("toJSON", {
    transform: function (_, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        return ret;
    },
});

const ExperienceLocation = mongoose.model("ExperienceLocation", ExperienceLocationSchema);

module.exports = ExperienceLocation;
