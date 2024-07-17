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
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
