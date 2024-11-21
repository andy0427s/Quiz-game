import {apiRequest} from "@/api/http.js";


export const requestCreateGame = async (
    {
        title,
        numberOfPlayers,
        numberOfTeams,
        timePerQuestion,
        randomizeQuestions,
        showLeaderboard,
        username,
        questionCount
    }
) => {
    return apiRequest.post(`/api/games/create`, {
        title,
        numberOfPlayers,
        numberOfTeams,
        timePerQuestion,
        randomizeQuestions,
        showLeaderboard,
        username,
        questionCount
    });
};

export const requestJoinGame = async (
    {
        username,
        pin
    }
) => {
    return apiRequest.post(`/api/games/join`, {
        username,
        pin
    });
}

export const requestReadyGame = async (
    {
        userId,
        gameId
    }
) => {
    return apiRequest.post(`/api/games/ready`, {
        userId,
        gameId
    });
}

export const requestAnswer = async (
    {
        userId,
        gameId,
        questionIndex,
        answer
    }
) => {
    return apiRequest.post(`/api/games/answer`, {
        userId,
        gameId,
        questionIndex,
        answer
    });
}

export const requestRecoverGame = async (userId) => {
    return apiRequest.post(`/api/games/recover`, {
        userId
    });
}