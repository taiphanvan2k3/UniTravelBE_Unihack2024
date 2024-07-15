const mongoose = require("mongoose");

const LocationEvaluationSchema = new mongoose.Schema({
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExperienceLocation",
        required: true,
    },
});

const LocationEvaluation = mongoose.model(
    "LocationEvaluation",
    LocationEvaluationSchema
);
