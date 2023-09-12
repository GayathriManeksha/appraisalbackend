const mongoose = require('mongoose');

const predefinedQuestionsSchema = new mongoose.Schema({
    questions: [String], // Array of predefined questions
});

const PredefinedQuestions = mongoose.model('PredefinedQuestions', predefinedQuestionsSchema);

module.exports = PredefinedQuestions;