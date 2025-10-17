// models/monitoredUser.js
module.exports = (sequelize, DataTypes) => {
  const MonitoredUser = sequelize.define('MonitoredUser', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Suspicious activity',
    },
  });

  return MonitoredUser;
};
