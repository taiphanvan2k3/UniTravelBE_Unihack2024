const mongoose = require("mongoose");

// Voucher dùng chung cho toàn bộ hệ thống
// Sẽ tặng cho các user khi họ có các bài post chất lượng hoặc giúp giúp trong việc bài trừ các bài vi phạm
const VoucherSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

VoucherSchema.index({ code: 1 });

const Voucher = mongoose.model("Voucher", VoucherSchema);
module.exports = Voucher;
