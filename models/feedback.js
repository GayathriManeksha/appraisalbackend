const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    appraisee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true,
    },
    strengths: String,
    improvements: String,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
