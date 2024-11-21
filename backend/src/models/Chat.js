const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
