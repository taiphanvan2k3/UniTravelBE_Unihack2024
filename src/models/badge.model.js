const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
    type: { type: String, required: true },
    upvoteCountMilestone: { type: Number, required: true },
    imageUrl: { type: String, required: true },
});

const Badge = mongoose.model("Badge", BadgeSchema);
module.exports = Badge;
