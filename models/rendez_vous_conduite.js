const mongoose = require('mongoose');

const RVC = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    temps: {
        type: String,
        required: true,

    },
    userId: {
        type: String,
        required: true,
    },
    monitorId: {
        type: String,
        required: true,
    },
    carId: {
        type: String,
        required: true,
    }
});
const RVCM = mongoose.model("meetingConduite", RVC);
module.exports = RVCM;