const express = require('express');
const { createGame, joinGame, readyGame, submitAnswer, recoverGame} = require('../controllers/gameController');

const router = express.Router();

router.post('/create', createGame);
router.post('/join', joinGame);
router.post('/ready', readyGame);
router.post('/answer', submitAnswer);
router.post('/recover', recoverGame);


module.exports = router;
