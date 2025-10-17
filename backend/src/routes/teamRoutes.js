const express = require('express');
const TeamController = require('../controllers/teamController.js');

const router = express.Router();

router.get('/', TeamController.getAllTeams);
router.get('/:id', TeamController.getTeamById);
router.post('/', TeamController.createTeam);
router.put('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);

module.exports = router;
