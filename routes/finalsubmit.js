const express = require('express');
const router = express.Router();
const SelfAppraisal = require('../models/selfAppr');


// API endpoint to update status for self-evaluation completion
router.put('/self-evaluation-completed', async (req, res) => {
    try {
        const userId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the status to indicate self-evaluation completion
        selfAppraisal.stage = 1;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the status for self-evaluation completion.' });
    }
});

// API endpoint to update status for evaluation completion
router.put('/evaluation-completed/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const evaluatorId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the status to indicate evaluation completion
        selfAppraisal.stage += 2; // Increment the status by 2

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the status for evaluation completion.' });
    }
});

// API endpoint to update status for peer review completion
router.put('/peer-review-completed/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const peerId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the status to indicate peer review completion
        selfAppraisal.stage += 3; // Increment the status by 3

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the status for peer review completion.' });
    }
});
// API endpoint to update status for final review completion
router.put('/final-review-completed/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const reviewerId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the status to indicate final review completion
        selfAppraisal.stage = 10;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the status for final review completion.' });
    }
});

router.get('/stage', async (req, res) => {
    try {
        const { userId } = req.params;
        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }
        res.json({ "stage": selfAppraisal.stage })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred ' });
    }
})
module.exports = router;
