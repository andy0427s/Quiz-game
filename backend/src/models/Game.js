const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
   title: { type: String, required: true },
   numberOfPlayers: { type: Number, required: true },
   numberOfTeams: { type: Number, required: true },
   timePerQuestion: { type: Number, default: 30 },
   randomizeQuestions: { type: Boolean, default: false },
   showLeaderboard: { type: Boolean, default: true },
   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
   players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
   teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }],
   hostId: { type: String, required: true },
   currentQuestion: { type: Number, default: 0 },
   currentQuestionStartTime: { type: Date },
   currentAnswerPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
   pin: { type: String, required: true },
   state: { type: String, enum: ['waiting', 'started', 'ended'], default: 'waiting' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Game', gameSchema);
