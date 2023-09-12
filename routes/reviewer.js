const express = require('express');
const router = express.Router();
const SelfAppraisal = require('../models/selfAppr'); // Import your SelfAppraisal model

// Define a route to list profiles for a reviewer to review
router.get('/profiles/:reviewerUserId', (req, res) => {
    // Extract the reviewer's userId from the request parameters
    // const reviewerUserId = req.params.reviewerUserId;
    const reviewerUserId = req.userid;

    // Use Mongoose to query self-appraisal profiles for review
    SelfAppraisal.find({ reviewid: reviewerUserId }, (err, profiles) => {
        if (err) {
            // Handle the error and send an error response
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while fetching profiles.' });
        }

        // Send the list of profiles as a JSON response
        res.json(profiles);
    });
});

router.post('/evaluate-professional-integrity-parameter', async (req, res) => {
    try {
        const reviewerUserId = req.userid;
        const { userId, responses } = req.body;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the reviewerScore in the professionalIntegrityQuestions based on the provided responses
        for (const response of responses) {
            const questionIndex = selfAppraisal.professionalIntegrityQuestions.findIndex((question) => {
                return question.questionText === response.text;
            });

            if (questionIndex !== -1) {
                // Update the reviewerScore for the found question
                selfAppraisal.professionalIntegrityQuestions[questionIndex].reviewerScore = response.score;
            }
        }

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving reviewer responses.' });
    }
});

router.post('/evaluate-responsibility-fulfillment', async (req, res) => {
    try {
        const reviewerUserId = req.userid;
        const { userId, responses } = req.body;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the reviewer's evaluation for responsibility fulfillment questions
        for (const response of responses) {
            const questionIndex = selfAppraisal.responsibilityFulfillmentQuestions.findIndex(
                (question) => question.questionText === response.question
            );

            if (questionIndex !== -1) {
                // Update the reviewer score for the corresponding question
                selfAppraisal.responsibilityFulfillmentQuestions[questionIndex].reviewerScore = response.score;
            }
        }

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while reviewing responsibility fulfillment questions.' });
    }
});

// API endpoint for the reviewer to evaluate knowledge based questions and submit scores
router.post('/evaluate-knowledge-based', async (req, res) => {
    try {
        const reviewerUserId = req.userid;
        const { userId, responses } = req.body;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the evaluator's evaluation for knowledge based questions
        for (const response of responses) {
            console.log(response)
            const questionIndex = selfAppraisal.knowledgeParameterQuestions.findIndex(
                (question) => question.questionText === response.question
            );
            console.log(questionIndex)
            if (questionIndex !== -1) {
                // Update the evaluator score for the corresponding question
                selfAppraisal.knowledgeParameterQuestions[questionIndex].reviewerScore = response.score;
            }
        }

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while evaluating responsibility fulfillment questions.' });
    }
});
module.exports = router;
