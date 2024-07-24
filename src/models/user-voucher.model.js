const mongoose = require("mongoose");

const UserVoucherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date, required: true },
});

UserVoucherSchema.index({ user: 1, voucher: 1 });

const UserVoucher = mongoose.model("UserVoucher", UserVoucherSchema);
module.exports = UserVoucher;
