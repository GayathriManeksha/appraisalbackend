const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // You'll need to install and configure JWT for authentication
const User = require('./userModel'); // Import your User model

// API for user login
router.post('/login', async (req, res) => {
    try {
        const { userId, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        // Check if the password matches (You should hash and compare passwords securely)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ userId: user.userId, role: user.role }, 'your-secret-key'); // Replace with your secret key

        // Return the user's role along with the token
        res.status(200).json({ role: user.role, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

module.exports = router;
