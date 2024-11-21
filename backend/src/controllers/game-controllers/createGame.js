const Game = require('../../models/Game');
const Question = require('../../models/Question');
const User = require('../../models/User');
const Team = require("../../models/Team");
const Answer = require('../../models/Answer');
const {getGameData} = require("../../services/game.service");
const createGame = async (req, res) => {
    try {
        const {
            title,
            numberOfPlayers,
            numberOfTeams,
            timePerQuestion = 30,
            randomizeQuestions = false,
            showLeaderboard = true,
            username,
            questionCount
        } = req.body;

        // Validate required fields
        if (!title || !numberOfPlayers || !numberOfTeams || !username || !questionCount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Randomly select questions from the Question collection
        const questions = await Question.aggregate([{ $sample: { size: questionCount } }]);

        // Extract the question IDs
        const questionIds = questions.map(question => question._id);

        // Generate a 6-digit random pin
        const pin = Math.floor(100000 + Math.random() * 900000).toString();

        // Create the new game
        const newGame = new Game({
            title,
            numberOfPlayers,
            numberOfTeams,
            timePerQuestion,
            randomizeQuestions,
            showLeaderboard,
            questions: questionIds,
            hostId: username,
            pin
        });

        await newGame.save();

        // Create the host user and add them to the game
        const user = new User({
            username,
            gameId: newGame._id
        });

        await user.save();

        // Add the user to the game's players array
        newGame.players.push(user._id);
        await newGame.save();

        const gameData = await getGameData(newGame._id);
        // Return the created user's ID
        res.status(201).json({ userId: user._id, pin, gameData });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ message: 'Failed to create game', error: error.message });
    }
};

module.exports = createGame;