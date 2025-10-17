'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    getImage() {
      let words = this.teamName.trim().split(" ");
      let lastWord = words[words.length - 1].toLowerCase();

      if (['ravens', 'chiefs', 'eagles', 'commanders', '49ers'].includes(lastWord))
        return `${lastWord}.png`;
      else
        return "default-image.png";
    }

    getNickname() {
      let words = this.teamName.trim().split(" ");
      return words[words.length - 1];
    }
  }
  Team.init({
    teamName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Team',
  });

  Team.associate = models => {
    Team.hasMany(models.Player, {
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });

    Team.hasMany(models.Account, {
      foreignKey: 'teamId',
      onDelete: 'CASCADE'
    });
  };

  return Team;
};