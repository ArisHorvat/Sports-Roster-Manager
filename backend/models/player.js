'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Player.init({
    name: DataTypes.STRING,
    number: DataTypes.INTEGER,
    position: DataTypes.STRING,
    age: DataTypes.INTEGER,
    experience: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player',
  });

  Player.associate = models => {
    Player.belongsTo(models.Team, {
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  return Player;
};
