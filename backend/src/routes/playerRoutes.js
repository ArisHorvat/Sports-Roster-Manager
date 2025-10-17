const express = require('express');
const { authenticateToken } = require('../../middlewares/auth.js');
const { requireAdmin } = require('../../middlewares/roles');
const { requireTeamOwnership } = require('../../middlewares/ownership.js');
const PlayerController = require('../controllers/playerController.js');

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, PlayerController.createPlayer);
router.get('/', PlayerController.getAllPlayers);
router.get('/team/:teamId', PlayerController.getAllPlayersFromTeam);
router.get('/:id', PlayerController.getPlayerById);
router.patch('/:id', authenticateToken, requireTeamOwnership, PlayerController.updatePlayer);
router.delete('/:id', authenticateToken, requireTeamOwnership, PlayerController.deletePlayer);

module.exports = router;
