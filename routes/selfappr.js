const express = require('express');
const router = express.Router();
const SelfAppraisal = require('../models/selfAppr');
const HRKnowledgeQuestions = require('../models/knowldegeqn');
const PredefinedQuestions = require('../models/predefinedqn');

// Endpoint to fill and store basic information
router.post('/self-appraise/basic-info', (req, res) => {
    const { userId, name, position, periodUnderReview, dateOccupiedPosition, anyotherposition } = req.body;

    const selfAppraisal = new SelfAppraisal({
        userId,
        name,
        position,
        periodUnderReview,
        dateOccupiedPosition,
        anyotherposition,
    });

    selfAppraisal.save((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while saving basic information.' });
        }

        res.status(200).json({ success: true });
    });
});

// Endpoint to fill and store questions for Responsibility Fulfillment
router.post('/responsibility-fulfillment', async (req, res) => {
    try {
        const { userId, responsibilities } = req.body;

        // Create a structuredResponsibilities array
        const structuredResponsibilities = responsibilities.map((responsibility) => ({
            text: responsibility.text,
            selfAppraisal: responsibility.selfAppraisal,
            evaluation: null,
            comments: null,
        }));

        // Create an array of questions for responsibility fulfillment
        const questions = responsibilities.map((responsibility) => ({
            questionText: responsibility.text,
            selfScore: null,
            evaluatorScore: null,
            reviewerScore: null,
        }));

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update responsibilities and responsibilityFulfillmentQuestions
        selfAppraisal.responsibilities = structuredResponsibilities;
        selfAppraisal.responsibilityFulfillmentQuestions = questions;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving Responsibility Fulfillment answers.' });
    }
});


// Endpoint to retrieve customized questions for Knowledge Parameters based on the user's role
router.get('/self-appraise/knowledge-questions/:role', (req, res) => {
    const role = req.params.role;

    HRKnowledgeQuestions.findOne({ role }, (err, knowledgeQuestions) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while fetching Knowledge Questions.' });
        }

        res.status(200).json({ questions: knowledgeQuestions ? knowledgeQuestions.questions : [] });
    });
});

// API to get predefined questions
router.get('/predefined-questions', async (req, res) => {
    try {
        // Find the predefined questions document
        const predefinedQuestions = await PredefinedQuestions.findOne();

        if (!predefinedQuestions) {
            return res.status(404).json({ error: 'Predefined questions not found.' });
        }

        // Return the array of predefined questions
        res.status(200).json({ questions: predefinedQuestions.questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching predefined questions.' });
    }
});

router.post('/evaluate-professional-integrity-parameter', async (req, res) => {
    try {
        const { userId, responses } = req.body;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Map responses to the question schema and add them to the professionalIntegrityQuestions array
        const professionalIntegrityQuestions = responses.map((response) => {
            return {
                questionText: response.text,
                selfScore: response.score,
                evaluatorScore: null, // Initialize evaluator score as null
                reviewerScore: null, // Initialize reviewer score as null
            };
        });

        // Update the professionalIntegrityQuestions array in the SelfAppraisal document
        selfAppraisal.professionalIntegrityQuestions = professionalIntegrityQuestions;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving professional integrity questions and self-evaluation scores.' });
    }
});

// API to get role-based questions
router.get('/get-position-based-questions', async (req, res) => {
    try {
        const { role } = req.body;

        // Find HRKnowledgeQuestions document for the specified role
        const hrKnowledgeQuestions = await HRKnowledgeQuestions.findOne({ role });

        if (!hrKnowledgeQuestions) {
            return res.status(404).json({ error: 'Questions not found for this role.' });
        }

        const questions = hrKnowledgeQuestions.questions;

        res.status(200).json({ questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching role-based questions.' });
    }
});

// API endpoint for the self to evaluate responsibility fulfillment questions and submit scores
router.post('/evaluate-responsibility-fulfillment', async (req, res) => {
    try {
        const { userId, responses } = req.body;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Update the self's evaluation for responsibility fulfillment questions
        for (const response of responses) {
            const questionIndex = selfAppraisal.responsibilityFulfillmentQuestions.findIndex(
                (question) => question.questionText === response.question
            );

            if (questionIndex !== -1) {
                // Update the self score for the corresponding question
                selfAppraisal.responsibilityFulfillmentQuestions[questionIndex].selfScore = response.score;
            }
        }

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while self-evaluating responsibility fulfillment questions.' });
    }
});
module.exports = router;