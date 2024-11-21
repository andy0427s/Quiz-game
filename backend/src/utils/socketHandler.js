const Game = require('../models/Game');
const User = require('../models/User');
const Chat = require('../models/Chat');
const {getGameData, getGameOfUser} = require("../services/game.service");
const {mongo} = require("mongoose");


/**
 *
 * @type {{
 *      [playerId: string]: [Player Socket]
 * }}
 */
const playerHandlers = {};

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('joinRoom', async (data) => {
            const {userId} = data;
            const game = await getGameOfUser(userId);
            if (game && game.state !== 'ended') {
                playerHandlers[userId] = socket;
                socket.emit('updateGame', game);
            }
        });

        socket.on('sendMessage', async (data) => {
           const { userId, gameId, message } = data;
           console.log('Message:', data);
           await Chat.create({
               sender: new mongo.ObjectId(userId),
               gameId: new mongo.ObjectId(gameId),
               message,
           });
           notifyMessagesOfGame(gameId);

        });


        socket.on('error', (error) => {
            console.log('Error:', error);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

    });
};

const notifyMessagesOfGame = async (gameId) => {
    const game = await getGameData(gameId);
    const messages = await Chat.find({gameId: new mongo.ObjectId(gameId.toString())}).populate('sender');
    const players = game.players;
    const playerIds = players.map(player => player._id.toString());
    for (let playerId of playerIds) {
        const socket = playerHandlers[playerId];
        if (socket) {
            console.log('Sending messages to player:', playerId);
            socket.emit('updateMessages', {
                gameData: game,
                messages
            });
        }
    }
}

const notifyPlayerOfGame = async (gameId) => {
    const game = await getGameData(gameId);
    const players = game.players;
    const playerIds = players.map(player => player._id.toString());

    for (let playerId of playerIds) {
        const socket = playerHandlers[playerId];
        if (socket) {
            socket.emit('updateGame', game);
        }
    }

}

module.exports = {
    socketHandler,
    notifyPlayerOfGame,
};