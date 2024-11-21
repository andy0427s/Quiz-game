const Game = require('../models/Game');

const createGame = require("./game-controllers/createGame");
const submitAnswer = require("./game-controllers/submitAnswer");
const joinGame = require("./game-controllers/joinGame");
const readyGame = require("./game-controllers/readyGame");
const {notifyPlayerOfGame} = require("../utils/socketHandler");
const recoverGame = require("./game-controllers/recoverGame");

const updateGamesProgress = async () => {
    try {
        const games = await Game.find({ state: 'started' }).populate('teams');
        await Promise.all(games.map(async game => {
            const questionDuration = game.timePerQuestion * 1000;

            const answerPlayers = [];

            for (let team of game.teams) {
                const { members } = team;
                const randomMember = members[Math.floor(Math.random() * members.length)];
                answerPlayers.push(randomMember);
            }

            if (game.currentQuestionStartTime === null) {
                game.currentQuestionStartTime = new Date();
                game.currentAnswerPlayers = answerPlayers;
                await game.save();
                // Notify players about the new question (using Socket.IO later)
                notifyPlayerOfGame(game._id);
                return;
            }

            const timeElapsed = new Date().getTime() - new Date(game.currentQuestionStartTime).getTime();
            if (timeElapsed >= questionDuration) {
                // Move to the next question
                game.currentQuestion += 1;
                if (game.currentQuestion >= game.questions.length) {
                    // End the game
                    game.state = 'ended';
                    await game.save();
                    notifyPlayerOfGame(game._id)
                    return;
                }

                game.currentQuestionStartTime = new Date();
                game.currentAnswerPlayers = answerPlayers;
                await game.save();
                notifyPlayerOfGame(game._id)
            }
        }));
    } catch (error) {
        console.log("Error in updateGamesProgress:", error);
    } finally {
        // Schedule the next update
        setTimeout(updateGamesProgress, 1000);
    }
}
updateGamesProgress();


module.exports = {
    createGame,
    joinGame,
    readyGame,
    submitAnswer,
    recoverGame
};
