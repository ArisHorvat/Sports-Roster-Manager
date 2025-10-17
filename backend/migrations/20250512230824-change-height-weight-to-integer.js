'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Players', 'height', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('Players', 'weight', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Players', 'height', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Players', 'weight', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
