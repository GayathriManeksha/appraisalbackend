const mongoose = require('mongoose');

// Define the PerformanceAppraisal schema
const performanceAppraisalSchema = new mongoose.Schema({
    appraiseeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appraisee', // Reference to the appraisee model
        required: true,
    },
    data: [
        {
            pointToConsider: String, // Point to be considered
            recommendation: String, // Recommendation of the Performance Appraisal
            accepted: Boolean, // Accepted/Not Accepted
            actionIfNotAccepted: String, // If not accepted, what action is to be taken?
        },
    ],
});

// Create the PerformanceAppraisal model
const PerformanceAppraisal = mongoose.model('PerformanceAppraisal', performanceAppraisalSchema);

// Export the model for use in other parts of your application
module.exports = PerformanceAppraisal;
