const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
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
    }

});
const RenderVous = mongoose.model("meetingCode", rendezVousSchema);
module.exports = RenderVous;