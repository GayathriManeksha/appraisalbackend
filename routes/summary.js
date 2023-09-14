const SelfAppraisal = require('../models/SelfAppraisal');

// Create a route to retrieve data for the table
router.get('/get-table-data/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the SelfAppraisal document by userId
        const selfAppraisal = await SelfAppraisal.findOne({ userId });

        if (!selfAppraisal) {
            return res.status(404).json({ error: 'Self Appraisal not found for this user.' });
        }

        // Define a function to calculate the final score
        const calculateFinalScore = (category) => {
            const { selfScore, evaluatorScore, reviewerScore } = category;
            return selfScore + evaluatorScore + reviewerScore;
        };

        // Extract the total scores for each category by self, review, and evaluator
        const tableData = {
            professionalIntegrity: {
                maxScore: 50,
                selfScore: selfAppraisal.professionalIntegrityQuestionsTotal.selfScore,
                evaluatorScore: selfAppraisal.professionalIntegrityQuestionsTotal.evaluatorScore,
                reviewerScore: selfAppraisal.professionalIntegrityQuestionsTotal.reviewerScore,
                finalScore: calculateFinalScore(selfAppraisal.professionalIntegrityQuestionsTotal),
                comments: '', // You can retrieve comments if available
            },
            knowledgeParameters: {
                maxScore: 50,
                selfScore: selfAppraisal.knowledgeParameterQuestionsTotal.selfScore,
                evaluatorScore: selfAppraisal.knowledgeParameterQuestionsTotal.evaluatorScore,
                reviewerScore: selfAppraisal.knowledgeParameterQuestionsTotal.reviewerScore,
                finalScore: calculateFinalScore(selfAppraisal.knowledgeParameterQuestionsTotal),
                comments: '', // You can retrieve comments if available
            },
            responsibilityFulfillment: {
                maxScore: 100,
                selfScore: selfAppraisal.responsibilityFulfillmentQuestionsTotal.selfScore,
                evaluatorScore: selfAppraisal.responsibilityFulfillmentQuestionsTotal.evaluatorScore,
                reviewerScore: selfAppraisal.responsibilityFulfillmentQuestionsTotal.reviewerScore,
                finalScore: calculateFinalScore(selfAppraisal.responsibilityFulfillmentQuestionsTotal),
                comments: '', // You can retrieve comments if available
            },
        };

        res.status(200).json(tableData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching table data.' });
    }
});
