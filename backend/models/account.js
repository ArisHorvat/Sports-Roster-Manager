'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  Account.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'admin']]
      }
    },
    teamId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Account',
    hooks: {
      beforeCreate: async (account) => {
        account.password = await bcrypt.hash(account.password, 10);
      },
      beforeUpdate: async (account) => {
        if (account.changed('password')) {
          account.password = await bcrypt.hash(account.password, 10);
        }
      }
    }
  });

  Account.associate = function(models) {
    // associations can be defined here
    Account.belongsTo(models.Team, {
      foreignKey: 'teamId',
      onDelete: 'SET NULL'
    });
  };
  return Account;
};