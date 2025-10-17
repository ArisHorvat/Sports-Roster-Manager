const express = require('express');
const { authenticateToken } = require('../../middlewares/auth');
const { requireAdmin } = require('../../middlewares/roles');
const { MonitoredUser } = require('../../models');
const router = express.Router();

// GET /admin/monitored-users
router.get('/monitored-users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await MonitoredUser.findAll();
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch monitored users:', error);
    res.status(500).json({ error: 'Failed to fetch monitored users' });
  }
});

module.exports = router;
