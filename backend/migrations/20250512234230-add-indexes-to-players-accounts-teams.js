'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   // Adding indexes to the Players table
    await queryInterface.addIndex('Players', ['teamId']);        // Index for teamId
    await queryInterface.addIndex('Players', ['age']);           // Index for age
    await queryInterface.addIndex('Players', ['experience']);    // Index for experience
    await queryInterface.addIndex('Players', ['position']);      // Index for position
    await queryInterface.addIndex('Players', ['number']);        // Index for number
    await queryInterface.addIndex('Players', ['height']);        // Index for height
    await queryInterface.addIndex('Players', ['weight']);        // Index for weight

    // Adding indexes to the Accounts table
    await queryInterface.addIndex('Accounts', ['username']);     // Index for username
    await queryInterface.addIndex('Accounts', ['teamId']);       // Index for teamId

    // Adding indexes to the Teams table
    await queryInterface.addIndex('Teams', ['teamName']);        // Index for teamName
  },

  async down (queryInterface, Sequelize) {
    // Removing indexes from the Players table
    await queryInterface.removeIndex('Players', ['teamId']);
    await queryInterface.removeIndex('Players', ['age']);
    await queryInterface.removeIndex('Players', ['experience']);
    await queryInterface.removeIndex('Players', ['position']);
    await queryInterface.removeIndex('Players', ['number']);
    await queryInterface.removeIndex('Players', ['height']);
    await queryInterface.removeIndex('Players', ['weight']);
    
    // Removing indexes from the Accounts table
    await queryInterface.removeIndex('Accounts', ['username']);
    await queryInterface.removeIndex('Accounts', ['teamId']);

    // Removing indexes from the Teams table
    await queryInterface.removeIndex('Teams', ['teamName']);
  }
};
