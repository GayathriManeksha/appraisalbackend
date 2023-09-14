const express = require('express');
const router = express.Router();
const Recommendation = require('../models/recommendations'); 


// Endpoint to store recommendation data
router.post('/submit-recommendation', async (req, res) => {
    try {
        const { appraiseeId, continuingServices, higherResponsibilities, higherPay } = req.body;

        // Create a new recommendation document
        const recommendation = new Recommendation({
            appraiseeId,
            continuingServices,
            higherResponsibilities,
            higherPay,
        });

        // Save the recommendation to the database
        await recommendation.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving recommendation.' });
    }
});

// Endpoint to retrieve recommendations for a specific appraisee
router.get('/get-recommendations/:appraiseeId', async (req, res) => {
    try {
        const appraiseeId = req.params.appraiseeId;

        // Find recommendations for the specified appraisee
        const recommendations = await Recommendation.findOne({ appraiseeId });

        if (!recommendations) {
            return res.status(404).json({ error: 'Recommendations not found for this appraisee.' });
        }

        res.status(200).json({ recommendations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching recommendations.' });
    }
});
module.exports = router;