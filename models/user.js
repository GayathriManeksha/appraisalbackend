const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['self', 'evaluator', 'reviewer', 'hr'],
        default: 'self', // Default role is self-appraiser
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
