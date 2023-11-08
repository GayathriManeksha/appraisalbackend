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
router.get('/getfeedback/:appraiseeId', async (req, res) => {
    try {
        const appraiseeId = req.params.appraiseeId;
        const feedback = await Feedback.find(appraiseeId); // Retrieve all feedback from the database
        res.json(feedback); // Send the retrieved feedback as a JSON response
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});
module.exports = router;