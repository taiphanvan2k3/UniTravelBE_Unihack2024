const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema(
    {
        code: { type: String, required: true },
        name: { type: String, required: true },
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ProvinceSchema.set("toObject", {
    transform: function (_, ret) {
        delete ret.__v;
        delete ret._id;
        return {
            code: ret.code,
            name: ret.name,
        };
    },
});

ProvinceSchema.set("toJSON", {
    transform: function (_, ret) {
        delete ret.__v;
        delete ret._id;
        return {
            code: ret.code,
            name: ret.name,
        };
    },
});

const Province = mongoose.model("Province", ProvinceSchema);
module.exports = Province;
