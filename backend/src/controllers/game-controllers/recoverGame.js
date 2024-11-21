const {getGameOfUser} = require("../../services/game.service");


const recoverGame = async (req, res) => {
    try {
        const {userId} = req.body;
        const game = await getGameOfUser(userId);
        if (!game) {
            return res.status(404).json({message: 'Game not found'});
        }
        res.status(200).json(game);
    } catch (error) {
        console.error('Error recovering game:', error);
        res.status(500).json({ message: 'Failed to recover the game', error: error.message });
    }
};

module.exports = recoverGame;