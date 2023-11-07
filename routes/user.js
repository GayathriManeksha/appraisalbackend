const express = require('express');
const SelfAppraisal = require('../models/selfAppr');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const uid = req.params.userId;
        console.log(uid)
        const name = await SelfAppraisal.find({ userId: uid }, { Name: 1, _id: 0 });
        console.log(name)
        res.json(name);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching userid' });
    }
})
module.exports = router