const Game = require('../../models/Game');
const Question = require('../../models/Question');
const User = require('../../models/User');
const Team = require("../../models/Team");
const Answer = require('../../models/Answer');
const {notifyPlayerOfGame} = require("../../utils/socketHandler");
const {getGameData} = require("../../services/game.service");
const joinGame = async (req, res) => {
    try {
        const { username, pin } = req.body;

        // Validate required fields
        if (!username || !pin) {
            return res.status(400).json({ message: 'Username and pin are required' });
        }

        // Find the game by pin
        const game = await Game.findOne({ pin }).populate('players');

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if the game is in the 'waiting' state and if there is space for more players
        if (game.state !== 'waiting') {
            return res.status(400).json({ message: 'Cannot join the game. The game has already started or ended.' });
        }

        if (game.players.length >= game.numberOfPlayers) {
            return res.status(400).json({ message: 'Cannot join the game. The player limit has been reached.' });
        }

        const oldPlayer = game.players.find(player => player.username === username);
        if (oldPlayer) {
            return res.status(400).json({ message: 'Cannot join the game. The username is already taken.' });
        }


        // Create a new user and associate it with the game
        const newUser = new User({
            username,
            gameId: game._id
        });

        await newUser.save();

        // Add the user to the game's players list
        game.players.push(newUser._id);
        await game.save();
        const gameData = await getGameData(game._id);

        // Notify other users about the new player joining
        notifyPlayerOfGame(game._id);
        // Respond with the new user's ID and the game's ID
        res.status(200).json({ userId: newUser._id, gameId: game._id, gameData });
    } catch (error) {
        console.error('Error joining game:', error);
        res.status(500).json({ message: 'Failed to join the game', error: error.message });
    }
};

module.exports = joinGame;