const Recommendation = require('../models/recommendations');
const PerformanceAppraisal = require('../models/performanceappraisal');

async function mapRecommendationsToPerformanceAppraisal(appraiseeId) {
    try {
        // Fetch recommendations for the specified appraisee
        const recommendations = await Recommendation.findOne({ appraiseeId });

        if (!recommendations) {
            // Handle the case where recommendations are not found
            console.log('Recommendations not found for appraiseeId:', appraiseeId);
            throw new Error('Recommendations not found for this appraisee.');
        }

        // Create an array to store the Performance Appraisal data
        const performanceAppraisalData = [];

        // Dynamically fetch attribute names
        const recommendationAttributes = Object.keys(recommendations.toObject());

        // Map attribute names to "Point to be considered" and "Recommendation of the Performance Appraisal"
        recommendationAttributes.forEach((attribute) => {
            if (attribute !== '_id' && attribute !== 'appraiseeId') {
                // Map attribute name to "Point to be considered"
                const pointToConsider = attribute;

                // Map attribute value to "Recommendation of the Performance Appraisal"
                const recommendation = recommendations[attribute];

                // Create a new Performance Appraisal data object
                const appraisalData = {
                    pointToConsider,
                    recommendation,
                    accepted: false, // Initialize to a default value, e.g., "Not Accepted"
                    actionIfNotAccepted: '', // Default to an empty string
                };

                // Push the data to the array
                performanceAppraisalData.push(appraisalData);
            }
        });

        // Create a new Performance Appraisal document with the data
        const performanceAppraisal = new PerformanceAppraisal({
            appraiseeId,
            data: performanceAppraisalData,
        });

        // Save the new Performance Appraisal document to the database
        await performanceAppraisal.save();

        // Return the created Performance Appraisal object
        return performanceAppraisal;
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = mapRecommendationsToPerformanceAppraisal;
