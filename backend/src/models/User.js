const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, default: 0 },
    isReady: { type: Boolean, default: false },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            answer: { type: String, required: true },
            correct: { type: Boolean, default: false },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
