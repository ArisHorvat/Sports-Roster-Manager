const { Player } = require('../models');

async function requireTeamOwnership(req, res, next) {
  const user = req.user; 
  const playerId = req.params.id;

  try {
    const player = await Player.findByPk(playerId);

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if user is admin or owns the team
    if (user.teamId === player.teamId) {
      return next();
    }

    return res.status(403).json({ error: 'You are not authorized to modify this player' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { requireTeamOwnership };
