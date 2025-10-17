const { Log } = require('../models');

async function logAction(username, action) {
  await Log.create({
    username,
    action,
    timestamp: new Date(),
  });
}

module.exports = { logAction };