const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
});

const Province = mongoose.model("Province", ProvinceSchema);
module.exports = Province;