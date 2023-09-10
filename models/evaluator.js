const mongoose = require('mongoose');

const evaluatorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Add evaluator-specific fields here
});

const Evaluator = mongoose.model('Evaluator', evaluatorSchema);

module.exports = Evaluator;
