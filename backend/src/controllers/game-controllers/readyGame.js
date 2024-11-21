const Game = require('../../models/Game');
const Question = require('../../models/Question');
const User = require('../../models/User');
const Team = require("../../models/Team");
const Answer = require('../../models/Answer');
const {notifyPlayerOfGame} = require("../../utils/socketHandler");

const readyGame = async (req, res) => {
    try {
        const { userId, gameId } = req.body;

        // Validate required fields
        if (!userId || !gameId) {
            return res.status(400).json({ message: 'User ID and Game ID are required' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user belongs to the specified game
        if (!user.gameId || user.gameId.toString() !== gameId) {
            return res.status(400).json({ message: 'User is not part of the specified game' });
        }

        // Mark the user as ready
        user.isReady = true;
        await user.save();

        // Fetch the game
        const game = await Game.findById(gameId).populate('players');
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.state === 'started') {
            return res.status(400).json({ message: 'Game has already started}' });
        }

        // Check if all players are ready and the game has reached the required number of players
        const readyPlayers = game.players.filter(player => player.isReady);
        if (readyPlayers.length === game.numberOfPlayers) {
            // Assign players to teams
            const teamSize = Math.ceil(game.numberOfPlayers / game.numberOfTeams);
            const teams = [];
            let currentTeam = [];

            for (let i = 0; i < readyPlayers.length; i++) {
                currentTeam.push(readyPlayers[i]._id);
                if (currentTeam.length === teamSize || i === readyPlayers.length - 1) {
                    // Create a new team
                    const newTeam = new Team({
                        gameId: game._id,
                        name: `Team ${teams.length + 1}`,
                        members: currentTeam
                    });
                    await newTeam.save();
                    teams.push(newTeam);

                    // Update players with their team ID
                    for (const playerId of currentTeam) {
                        const player = await User.findById(playerId);
                        player.teamId = newTeam._id;
                        await player.save();
                    }

                    // Reset currentTeam for the next iteration
                    currentTeam = [];
                }
            }

            // Update the game with teams and change state to 'started'
            game.teams = teams.map(team => team._id);
            game.state = 'started';

            game.currentQuestionStartTime = null;

            await game.save();
            notifyPlayerOfGame(game._id);
        }
        notifyPlayerOfGame(game._id);

        res.status(200).json({ message: 'User is ready', gameId: game._id });
    } catch (error) {
        console.error('Error in readyGame:', error);
        res.status(500).json({ message: 'Failed to mark user as ready', error: error.message });
    }
};

module.exports = readyGame;