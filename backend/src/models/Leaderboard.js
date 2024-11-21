const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    scores: [
        {
            teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
            points: { type: Number, default: 0 },
        },
    ],
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
