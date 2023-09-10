const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: String,
    selfScore: Number,
    evaluatorScore: Number,
    reviewerScore: Number,
});

module.exports=questionSchema