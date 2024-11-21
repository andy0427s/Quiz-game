const moment = require("moment");
const Game = require("../models/Game");
const User = require("../models/User");
const Answer = require("../models/Answer");
const {mongo} = require("mongoose");
const getGameData = async (gameId) => {
    const game = await Game
        .findById(gameId.toString())
        .populate('players')
        .populate({
            path: 'teams',
            populate: {
                path: 'members',
                model: 'User'
            }
        })
        .populate('questions');


    const questions = game.questions;
    const currentQuestion = questions[game.currentQuestion];

    const currentQuestionAnswers = await Answer.find({
        gameId: new mongo.ObjectId(gameId.toString()),
        questionIndex: game.currentQuestion,
    });

    const teamsScore = [];
    for (const team of game.teams) {
       let score = 0;

       const members = team.members;
       for (const member of members) {
            const answersOfMember = await Answer.find({
                gameId: new mongo.ObjectId(gameId.toString()),
                userId: member._id,
            });
            for (let answer of answersOfMember) {
                const question = questions[answer.questionIndex];
                if (answer.answer === question.options[question.correctAnswer]) {
                    score += 1;
                }
            }
       }

         teamsScore.push({
              team: team.name,
              score
         });
    }



    return {
        _id: game._id,
        title: game.title,
        numberOfPlayers: game.numberOfPlayers,
        numberOfTeams: game.numberOfTeams,
        timePerQuestion: game.timePerQuestion,
        showLeaderboard: game.showLeaderboard,
        currentQuestion: game.state === 'started' ? {
            text: currentQuestion.text,
            options: currentQuestion.options,
        } : null,
        currentQuestionTimeLeft: moment(game.currentQuestionStartTime).add(game.timePerQuestion, 'seconds').diff(moment(), 'seconds'),
        currentQuestionIndex: game.currentQuestion,
        currentQuestionStartTime: game.currentQuestionStartTime,
        currentAnswerPlayers: game.currentAnswerPlayers,
        currentQuestionAnswers: currentQuestionAnswers.map(answer => {
            return {
                answer: answer.answer,
                userId: answer.userId,
                isCorrect: answer.answer === currentQuestion.options[currentQuestion.correctAnswer]
            }
        }),
        state: game.state,
        players: game.players,
        teams: game.teams,
        pin: game.pin,
        questionCount: questions.length,
        teamsScore
    }
}

/**
 * Get the game of a user
 * @param userId
 * @returns {Promise<*|null>}
 */
const getGameOfUser = async (userId) => {
    try {
        const user = await User.findById(userId).populate('gameId');
        if (!user) {
            return null;
        }

        return await getGameData(user.gameId._id.toString());
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    getGameData,
    getGameOfUser
}