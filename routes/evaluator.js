const express = require('express');
const router = express.Router();
const SelfAppraisal = require('../models/selfAppr'); // Import your SelfAppraisal model


// Define a route to list profiles for an evaluator to evaluate
router.get('/profiles', async (req, res) => {
    try {
        // Extract the evaluator's userId from the request user data
        const evaluatorUserId = req.userid;

        // Use Mongoose to query self-appraisal profiles for evaluation
        const profiles = await SelfAppraisal.find(
            { evaluationid: evaluatorUserId },
            { Name: 1, userId: 1, _id: 0 } // Projection to select Name and userId fields
        );

        // Send the list of profiles with only names and userIds as a JSON response
        res.json(profiles);
    } catch (err) {
        // Handle any errors and send an error response
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching profiles.' });
    }
});

// API to save evaluator's responses to evaluation questions
router.post('/evaluate-professional-integrity-parameter', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        const evaluatorUserId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the evaluatorScore in the professionalIntegrityQuestions based on the provided responses
        for (const response of responses) {
            console.log(response.text)
            const questionIndex = selfAppraisal.professionalIntegrityQuestions.findIndex((question) => {
                return question.questionText === response.text;
            });

            if (questionIndex !== -1) {
                // Update the evaluatorScore for the found question
                console.log(selfAppraisal.professionalIntegrityQuestions[questionIndex])
                selfAppraisal.professionalIntegrityQuestions[questionIndex].evaluatorScore = response.score;
            }
        }

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving evaluator responses.' });
    }
});

// API endpoint for the evaluator to evaluate responsibilities
router.post('/evaluate-responsibilities', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        const evaluatorUserId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the evaluation of responsibilities
        for (const response of responses) {
            const responsibilityIndex = selfAppraisal.responsibilities.findIndex(
                (responsibility) => responsibility.text === response.text
            );

            if (responsibilityIndex !== -1) {
                // Update the evaluation based on response.agree
                selfAppraisal.responsibilities[responsibilityIndex].evaluation = response.agree;

                // If response.agree is false, save response.comments
                if (!response.agree) {
                    selfAppraisal.responsibilities[responsibilityIndex].comments = response.comments;
                }
            }
        }

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while evaluating responsibilities.' });
    }
});


// API endpoint for the evaluator to evaluate responsibility fulfillment questions and submit scores
router.post('/evaluate-responsibility-fulfillment', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        const evaluatorUserId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the evaluator's evaluation for responsibility fulfillment questions
        for (const response of responses) {
            const questionIndex = selfAppraisal.responsibilityFulfillmentQuestions.findIndex(
                (question) => question.questionText === response.question
            );

            if (questionIndex !== -1) {
                // Update the evaluator score for the corresponding question
                selfAppraisal.responsibilityFulfillmentQuestions[questionIndex].evaluatorScore = response.score;
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

// API endpoint for the evaluator to evaluate knowledge based questions and submit scores
router.post('/evaluate-knowledge-based', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        const evaluatorUserId = req.userid;

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
                selfAppraisal.knowledgeParameterQuestions[questionIndex].evaluatorScore = response.score;
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
