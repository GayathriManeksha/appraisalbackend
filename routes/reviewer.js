const express = require('express');
const router = express.Router();
const SelfAppraisal = require('../models/selfAppr'); // Import your SelfAppraisal model

// GET profiles for review by a reviewer
router.get('/profiles', async (req, res) => {
    try {
        // Extract the reviewer's userId from the request user data
        const reviewerUserId = req.userid;

        // Use Mongoose to query self-appraisal profiles for review
        const profiles = await SelfAppraisal.find({ reviewid: reviewerUserId }, { Name: 1, userId: 1, _id: 0 });

        // Send the list of profiles as a JSON response
        res.json(profiles);
    } catch (err) {
        // Handle any errors and send an error response
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching profiles.' });
    }
});


// API endpoint for the reviewer to evaluate professional integrity parameter questions and submit scores
router.post('/evaluate-professional-integrity-parameter', async (req, res) => {
    try {
        const reviewerUserId = req.userid;
        const { userId, responses } = req.body;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Initialize total reviewer score
        let totalReviewerScore = 0;

        // Map responses to the question schema and update the reviewer score
        for (const response of responses) {
            const questionIndex = selfAppraisal.professionalIntegrityQuestions.findIndex((question) => {
                return question.questionText === response.text;
            });

            if (questionIndex !== -1) {
                // Update the reviewer score for the found question
                const score = parseInt(response.score, 10);
                selfAppraisal.professionalIntegrityQuestions[questionIndex].reviewerScore = score;
                totalReviewerScore += score; // Update the total reviewer score
            }
        }

        // Update the total reviewer score in the SelfAppraisal document
        selfAppraisal.professionalIntegrityQuestionsTotal.reviewerScore = totalReviewerScore;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving reviewer responses.' });
    }
});

// API endpoint for the reviewer to evaluate responsibility fulfillment questions and submit scores
router.post('/evaluate-responsibility-fulfillment', async (req, res) => {
    try {
        const reviewerUserId = req.userid;
        const { userId, responses } = req.body;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Initialize total reviewer score
        let totalReviewerScore = 0;

        // Map responses to the question schema and update the reviewer score
        for (const response of responses) {
            const questionIndex = selfAppraisal.responsibilityFulfillmentQuestions.findIndex(
                (question) => question.questionText === response.question
            );

            if (questionIndex !== -1) {
                // Update the reviewer score for the found question
                const score = parseInt(response.score, 10);
                selfAppraisal.responsibilityFulfillmentQuestions[questionIndex].reviewerScore = score;
                totalReviewerScore += score; // Update the total reviewer score
            }
        }

        // Update the total reviewer score in the SelfAppraisal document
        selfAppraisal.responsibilityFulfillmentQuestionsTotal.reviewerScore = totalReviewerScore;

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

        // Initialize total reviewer score
        let totalReviewerScore = 0;

        // Map responses to the question schema and update the reviewer score
        for (const response of responses) {
            const questionIndex = selfAppraisal.knowledgeParameterQuestions.findIndex(
                (question) => question.questionText === response.question
            );

            if (questionIndex !== -1) {
                // Update the reviewer score for the found question
                const score = parseInt(response.score, 10);
                selfAppraisal.knowledgeParameterQuestions[questionIndex].reviewerScore = score;
                totalReviewerScore += score; // Update the total reviewer score
            }
        }

        // Update the total reviewer score in the SelfAppraisal document
        selfAppraisal.knowledgeParameterQuestionsTotal.reviewerScore = totalReviewerScore;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while reviewing knowledge-based questions.' });
    }
});




router.post('/get-professional-integrity', async (req, res) => {
    try {
        const userId = req.userid;
        const { apprId } = req.body;
        console.log(apprId)
        const selfAppraisal = await SelfAppraisal.findOne({ userId: apprId }, { professionalIntegrityQuestions: 1, _id: 0 });
        res.status(200).json(selfAppraisal);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while getting data.' });
    }
})

router.post('/get-knowledge-based', async (req, res) => {
    try {
        const userId = req.userid;
        const { apprId } = req.body;
        console.log(apprId)
        const selfAppraisal = await SelfAppraisal.findOne({ userId: apprId }, {
            knowledgeParameterQuestions: 1, _id: 0
        });
        res.status(200).json(selfAppraisal);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while getting data.' });
    }
})

router.post('/get-responsibility-based', async (req, res) => {
    try {
        const userId = req.userid;
        const { apprId } = req.body;
        console.log(apprId)
        const selfAppraisal = await SelfAppraisal.findOne({ userId: apprId }, {
            responsibilityFulfillmentQuestions: 1, _id: 0
        });
        res.status(200).json(selfAppraisal);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while getting data.' });
    }
})

module.exports = router;
