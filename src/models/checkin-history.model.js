const mongoose = require("mongoose");

const CheckInHistorySchema = new mongoose.Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
        },
        experienceLocation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExperienceLocation",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastCheckIn: { type: Date, default: Date.now },
    },
    {
        validateBeforeSave: true,
    }
);

// Kiểm tra phải một trong hai trường store hoặc experienceLocation phải có giá trị
CheckInHistorySchema.pre("save", function (next) {
    if (!this.store && !this.experienceLocation) {
        throw new Error("store or experienceLocation is required");
    }
    next();
});

CheckInHistorySchema.index({ user: 1, store: 1 });
CheckInHistorySchema.index({ user: 1, experienceLocation: 1 });

const CheckInHistory = mongoose.model("CheckInHistory", CheckInHistorySchema);
module.exports = CheckInHistory;
