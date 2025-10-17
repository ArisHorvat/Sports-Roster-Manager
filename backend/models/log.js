module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    username: DataTypes.STRING,
    action: DataTypes.STRING,
    timestamp: DataTypes.DATE,
  });

  return Log;
};