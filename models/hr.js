const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Add HR-specific fields here
});

const HR = mongoose.model('HR', hrSchema);

module.exports = HR;
