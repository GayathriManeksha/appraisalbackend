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

// API endpoint for the evaluator to evaluate professional integrity parameter questions and submit scores
router.post('/evaluate-professional-integrity-parameter', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        const evaluatorUserId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Initialize total evaluator score
        let totalEvaluatorScore = 0;

        // Map responses to the question schema and update the evaluator score
        for (const response of responses) {
            console.log(response)
            const questionIndex = selfAppraisal.professionalIntegrityQuestions.findIndex(
                (question) => question.questionText === response.text
            );

            if (questionIndex !== -1) {
                // Update the evaluator score for the found question
                const score = parseInt(response.score, 10);
                selfAppraisal.professionalIntegrityQuestions[questionIndex].evaluatorScore = score;
                totalEvaluatorScore += score; // Update the total evaluator score
            }
        }

        // Update the total evaluator score in the SelfAppraisal document
        selfAppraisal.professionalIntegrityQuestionsTotal.evaluatorScore = totalEvaluatorScore;

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
    ``
    try {
        const { userId, responses } = req.body;
        const evaluatorUserId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }
        console.log(selfAppraisal.responsibilities);
        // Update the evaluation of responsibilities
        for (const response of responses) {
            console.log(response)
            const responsibilityIndex = selfAppraisal.responsibilities.findIndex(
                (responsibility) => responsibility.text === response.responsibility
            );
            console.log(responsibilityIndex);
            if (responsibilityIndex !== -1) {
                // Update the evaluation based on response.agree
                selfAppraisal.responsibilities[responsibilityIndex].evaluation = response.evaluate;
                console.log(selfAppraisal.responsibilities[responsibilityIndex].evaluation)
                // If response.agree is false, save response.comments
                // if (!(response.comments==="no")) {
                    selfAppraisal.responsibilities[responsibilityIndex].comments = response.comments;
                // }
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

        // Initialize total evaluator score
        let totalEvaluatorScore = 0;

        // Map responses to the question schema and update the evaluator score
        for (const response of responses) {
            const questionIndex = selfAppraisal.responsibilityFulfillmentQuestions.findIndex(
                (question) => question.questionText === response.question
            );

            if (questionIndex !== -1) {
                // Update the evaluator score for the found question
                const score = parseInt(response.score, 10);
                selfAppraisal.responsibilityFulfillmentQuestions[questionIndex].evaluatorScore = score;
                totalEvaluatorScore += score; // Update the total evaluator score
            }
        }
        console.log(totalEvaluatorScore)
        // Update the total evaluator score in the SelfAppraisal document
        selfAppraisal.responsibilityFulfillmentQuestionsTotal.evaluatorScore = totalEvaluatorScore;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while evaluating responsibility fulfillment questions.' });
    }
});


// API endpoint for the evaluator to evaluate knowledge-based questions and submit scores
router.post('/evaluate-knowledge-based', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        const evaluatorUserId = req.userid;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Initialize total evaluator score
        let totalEvaluatorScore = 0;

        // Map responses to the question schema and update the evaluator score
        for (const response of responses) {
            console.log(response)
            const questionIndex = selfAppraisal.knowledgeParameterQuestions.findIndex(
                (question) => question.questionText === response.text
            );

            if (questionIndex !== -1) {
                // Update the evaluator score for the found question
                const score = parseInt(response.score, 10);
                selfAppraisal.knowledgeParameterQuestions[questionIndex].evaluatorScore = score;
                totalEvaluatorScore += score; // Update the total evaluator score
            }
        }

        // Update the total evaluator score in the SelfAppraisal document
        selfAppraisal.knowledgeParameterQuestionsTotal.evaluatorScore = totalEvaluatorScore;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while evaluating knowledge-based questions.' });
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

router.get('/responsibilities/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const selfAppraisal = await SelfAppraisal.findOne({ userId });
        res.status(200).json(selfAppraisal.responsibilities);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching' });
    }
});
module.exports = router;
