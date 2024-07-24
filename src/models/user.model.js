const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firebaseUserId: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    displayName: { type: String, required: false },
    imageUrl: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: false },
    isAdmin: { type: Boolean, required: true },
    isVerified: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    roles: { type: [String], default: ["traveler"] },

    // Lưu trữ số lần đạt các cột mốc về lượt upvote của bài viết
    mileStonePosts: [
        {
            // Ví dụ: 10, 20, 30, 40, 50 vote
            voteMilestone: { type: Number, required: true },
            quantity: { type: Number, default: 0 },
        },
    ],
});

UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

UserSchema.set("toObject", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
