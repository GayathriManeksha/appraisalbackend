const express = require('express');
const router = express.Router();
const SelfAppraisal = require('./selfAppraisalModel'); // Import your SelfAppraisal model

// API endpoint to get the status value of a self-appraisal by userId
router.get('/get-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Retrieve the status value
        const status = selfAppraisal.stage;

        res.status(200).json({ status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving the status.' });
    }
});

module.exports = router;
