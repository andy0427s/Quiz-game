const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionIndex: { type: Number, required: true },
    answer: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Answer', answerSchema);
