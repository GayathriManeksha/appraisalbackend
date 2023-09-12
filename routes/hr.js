const express = require('express');
const router = express.Router();
const SelfAppraisal = require('../models/selfAppr');
const HRKnowledgeQuestions = require('../models/knowldegeqn');
const PredefinedQuestions = require('../models/predefinedqn');
const User = require('../models/user'); // Import your User model

// Endpoint for HR to save predefined questions
// API to add a new predefined question
router.post('/add-predefined-question', async (req, res) => {
    try {
        const { questionText } = req.body;

        // Find the predefined questions document
        var predefinedQuestions = await PredefinedQuestions.findOne();

        if (!predefinedQuestions) {
            predefinedQuestions = new PredefinedQuestions({})
        }

        // Add the new question to the array of predefined questions
        predefinedQuestions.questions.push(questionText);

        // Save the updated predefined questions document
        await predefinedQuestions.save();

        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the predefined question.' });
    }
});

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


// Endpoint for HR to save role-based questions
router.post('/add-position-based-question', async (req, res) => {
    try {
        const { role, question } = req.body;

        // Find or create an HRKnowledgeQuestions document for the specified role
        let hrKnowledgeQuestions = await HRKnowledgeQuestions.findOne({ role });

        if (!hrKnowledgeQuestions) {
            // If no document exists for the role, create a new one
            hrKnowledgeQuestions = new HRKnowledgeQuestions({
                role,
                questions: [question], // Initialize with the first question
            });
        } else {
            // Add the new question to the existing questions array
            hrKnowledgeQuestions.questions.push(question);
        }

        // Save the updated HRKnowledgeQuestions document
        await hrKnowledgeQuestions.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while saving the role-based question.' });
    }
});


// API to add a new user by HR
router.post('/add-user', async (req, res) => {
    try {
        const { userId, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ userId });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // Create a new User document
        const newUser = new User({
            userId,
            password,
            role,
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});

router.post('/assignto', async (req, res) => {
    try {
        const { userId, evaluatorId, reviewerId } = req.body;

        // Find the SelfAppraisal document by userId
        const user = await User.findOne({ userId })
        var selfAppraisal = await SelfAppraisal.findOne({ userId: user._id });
        console.log(selfAppraisal)

        if (!selfAppraisal) {

            // Create a new SelfAppraisal document if it doesn't exist
            selfAppraisal = new SelfAppraisal({
                userId: user._id,
            });

        }

        // Fetch the ObjectId for the evaluator and reviewer based on their userId
        const evaluator = await User.findOne({ userId: evaluatorId });
        const reviewer = await User.findOne({ userId: reviewerId });

        if (!evaluator || !reviewer) {
            return res.status(404).json({ error: 'Evaluator or reviewer not found.' });
        }

        // Assign evaluator and reviewer by ObjectId
        selfAppraisal.evaluationid = evaluator._id;
        selfAppraisal.reviewid = reviewer._id;

        // Save the updated SelfAppraisal document
        await selfAppraisal.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while assigning reviewers and evaluators.' });
    }
});


module.exports = router;