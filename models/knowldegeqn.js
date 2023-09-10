const mongoose = require('mongoose');

const hrKnowledgeQuestionsSchema = new mongoose.Schema({
    role: String, // Role for which the questions are customized
    questions: [String], // Array of customized questions
});

const HRKnowledgeQuestions = mongoose.model('HRKnowledgeQuestions', hrKnowledgeQuestionsSchema);

module.exports = HRKnowledgeQuestions;
