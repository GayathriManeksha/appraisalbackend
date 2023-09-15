const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    appraiseeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appraisee', // Reference to the appraisee model
        required: true,
    },
    continuingServices: {
        type: String,
        required: true,
    },
    higherResponsibilities: {
        type: String,
        required: true,
    },
    higherPay: {
        type: String,
        required: true,
    },
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
