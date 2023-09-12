const mongoose = require('mongoose');
const questionSchema = require('./question')

const responsibilitySchema = new mongoose.Schema({
    text: String,
    selfAppraisal: String,
    evaluation: Boolean, //string
    comments: String,
});

//Add one more thing status to see in which stage is the evaluation in
//on submission by self the value is 1 , on evaluator value is 1+2 , peer 1+3 , when value is 1+2+3 ready for review
const selfAppraisalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    periodUnderReview: { type: String, default: null },
    dateOccupiedPosition: { type: Date, default: null },

    professionalIntegrityQuestions: [questionSchema],
    responsibilityFulfillmentQuestions: [questionSchema],
    knowledgeParameterQuestions: [questionSchema],

    // Add other self-appraisal fields as needed
    position: { type: String, default: null },
    Name: { type: String, default: null },
    anyotherposition: { type: String, default: null },
    responsibilities: [responsibilitySchema],
    evaluationid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    stage: { type: Number, default: 1 }
});

const SelfAppraisal = mongoose.model('SelfAppraisal', selfAppraisalSchema);

module.exports = SelfAppraisal;
