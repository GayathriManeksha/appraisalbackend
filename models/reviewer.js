const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Add reviewer-specific fields here
});

const Reviewer = mongoose.model('Reviewer', reviewerSchema);

module.exports = Reviewer;
