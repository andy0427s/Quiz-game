const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Room', roomSchema);
