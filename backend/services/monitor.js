const { Log, MonitoredUser } = require('../models');
const { Op } = require('sequelize');

async function monitorLogs() {
  const now = new Date();
  const windowStart = new Date(now - 60 * 1000); // last 1 minute

  const logs = await Log.findAll({
    where: { timestamp: { [Op.gt]: windowStart } },
  });

  const userActivity = {};

  logs.forEach(log => {
    const username = log.username;
    userActivity[username] = (userActivity[username] || 0) + 1;
  });

  for (const [username, count] of Object.entries(userActivity)) {
    if (count >= 10) { 
      await MonitoredUser.findOrCreate({ where: { username } });
      console.log(`User ${username} flagged as suspicious`);
    }
  }
}

setInterval(monitorLogs, 30 * 1000); // every 30 sec

module.exports={monitorLogs};
