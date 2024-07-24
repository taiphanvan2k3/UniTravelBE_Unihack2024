const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    time: String,
    title: String,
    description: String,
    subActivities: [{
        description: String
    }]
});

const DaySchema = new mongoose.Schema({
    day: Number,
    activities: [ActivitySchema]
});

const ScheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['province', 'location'], required: true },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExperienceLocation',
        required: function() { return this.type === 'location'; } // Required if type is 'location'
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province',
        required: function() { return this.type === 'province'; } // Required if type is 'province'
    },
    schedule: [DaySchema],
    numDays: { type: Number, default: 1 } // Number of days for the itinerary
}, {
    timestamps: true
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);
module.exports = Schedule;
