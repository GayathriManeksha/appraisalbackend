const express = require('express');
const router = express.Router();
const Recommendation = require('../models/recommendations');
const PerformanceAppraisal = require('../models/performanceappraisal'); // Import the PerformanceAppraisal model



// API endpoint to fetch recommendations for a specific appraisee


// API endpoint to save acceptance response and action
// API endpoint to save acceptance response and action
router.post('/save-acceptance-and-action/:appraiseeId', async (req, res) => {
    try {
        const appraiseeId = req.params.appraiseeId;
        const { data } = req.body;

        // Create an array to store Performance Appraisal data
        const performanceAppraisalData = [];

        // Iterate through data and populate the performanceAppraisalData array
        for (const item of data) {
            const { pointToConsider, recommendation, accepted, actionIfNotAccepted } = item;

            // Create a new Performance Appraisal data object
            const appraisalData = {
                pointToConsider,
                recommendation,
                accepted,
                actionIfNotAccepted,
            };

            // Push the data object to the array
            performanceAppraisalData.push(appraisalData);
        }

        // Create a new Performance Appraisal document with the data
        const performanceAppraisal = new PerformanceAppraisal({
            appraiseeId,
            data: performanceAppraisalData,
        });

        // Save the Performance Appraisal document
        await performanceAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving acceptance and action data.' });
    }
});


// Import necessary modules and models at the top of your file

// Define a GET API endpoint to fetch and display performance appraisal records
router.get('/performance-appraisals/:appraiseeId', async (req, res) => {
    try {
        const appraiseeId = req.params.appraiseeId;

        // Fetch performance appraisal records for the specified appraiseeId
        const records = await PerformanceAppraisal.find({ appraiseeId });

        // Check if records were found
        if (!records || records.length === 0) {
            return res.status(404).json({ error: 'Performance appraisal records not found for this appraisee.' });
        }

        // Return the records as a JSON response
        res.status(200).json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching performance appraisal records.' });
    }
});




module.exports = router;