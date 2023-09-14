const express = require('express');
const router = express.Router();

const PerformanceAppraisal = require('../models/performanceappraisal');
const mapRecommendationsToPerformanceAppraisal = require('../controllers/performanceapp'); // Import the function

// Your other route handlers and middleware...

// Create a POST API endpoint to fill acceptance and action fields
router.post('/fill-acceptance-and-action/:appraiseeId', async (req, res) => {
    try {
        const appraiseeId = req.params.appraiseeId;

        // Fetch and map recommendations to Performance Appraisal
        const performanceAppraisal = await mapRecommendationsToPerformanceAppraisal(appraiseeId);

        if (!performanceAppraisal) {
            return res.status(404).json({ error: 'Performance Appraisal not found.' });
        }

        // Update acceptance and action fields based on the request body
        const { data } = req.body;

        if (data && Array.isArray(data)) {
            data.forEach(async (item) => {
                const { pointToConsider, accepted, actionIfNotAccepted } = item;

                // Find the corresponding data entry in the Performance Appraisal
                const appraisalData = performanceAppraisal.data.find((dataEntry) => dataEntry.pointToConsider === pointToConsider);

                if (appraisalData) {
                    appraisalData.accepted = accepted;
                    appraisalData.actionIfNotAccepted = actionIfNotAccepted;
                }
            });

            // Save the updated Performance Appraisal document
            await performanceAppraisal.save();

            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ error: 'Invalid request data.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating acceptance and action fields.' });
    }
});

module.exports = router;
