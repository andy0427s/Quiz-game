const Game = require('../../models/Game');
const Question = require('../../models/Question');
const User = require('../../models/User');
const Team = require("../../models/Team");
const Answer = require('../../models/Answer');
const {notifyPlayerOfGame} = require("../../utils/socketHandler");
const submitAnswer = async (req, res) => {
    try {
        const { userId, gameId, questionIndex, answer } = req.body;

        // Validate required fields
        if (!userId || !gameId || !Number.isInteger(questionIndex) || !answer) {
            return res.status(400).json({ message: 'All fields (userId, gameId, questionId, answer) are required' });
        }

        // Validate user existence
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate game existence
        const game = await Game.findById(gameId).populate('currentAnswerPlayers').populate('questions');
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }


        // Validate user belongs to the game
        if (user.gameId.toString() !== gameId) {
            return res.status(400).json({ message: 'User does not belong to the specified game' });
        }

        // Check if the game has ended
        if (game.state === 'ended') {
            return res.status(400).json({ message: 'The game has already ended' });
        }


        // Validate if the user is allowed to answer this question
        const isUserAllowed = game.currentAnswerPlayers.some(player => player._id.toString() === userId);
        if (!isUserAllowed) {
            return res.status(400).json({ message: 'User is not allowed to answer this question' });
        }


        // Check if the answer is valid
        const question = game.questions[questionIndex];
        if (!question.options.includes(answer)) {
            return res.status(400).json({ message: 'Invalid answer option' });
        }

        // Create a new answer record
        const newAnswer = new Answer({
            gameId,
            userId,
            questionIndex,
            answer
        });

        await newAnswer.save();

        // Determine if the answer is correct
        const isCorrect = question.options[question.correctAnswer] === answer;

        // Update user and team scores if the answer is correct
        if (isCorrect) {
            user.score += 1;
            await user.save();

            if (user.teamId) {
                const team = await Team.findById(user.teamId);
                if (team) {
                    team.score += 1;
                    await team.save();
                }
            }
        }

        // Notify other players about the answer submission (using Socket.IO later)
        notifyPlayerOfGame(game._id);

        res.status(200).json({ message: 'Answer submitted successfully', correct: isCorrect });
    } catch (error) {
        console.error('Error in submitAnswer:', error);
        res.status(500).json({ message: 'Failed to submit answer', error: error.message });
    }
};

module.exports = submitAnswer;