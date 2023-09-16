const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');


// Endpoint to store feedback data
router.post('/submit-feedback', async (req, res) => {
    try {
        const { appraiseeId, strengths, improvements } = req.body;
        console.log(req.body);
        console.log("hii");


        // Create a new feedback document
        const feedback = new Feedback({
            appraisee: appraiseeId, // Associate feedback with the appraisee
            strengths,
            improvements,
        });

        // Save the feedback to the database
        await feedback.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving feedback.' });
    }
    console.log(req.body);

});
module.exports = router;