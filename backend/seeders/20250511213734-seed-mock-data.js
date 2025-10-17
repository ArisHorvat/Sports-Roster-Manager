'use strict';

const { MockData } = require('../src/MockData.cjs');
const bcrypt = require('bcrypt');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Teams', MockData.teams.map(team => ({
      teamName: team.teamName,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    // Then Players
    await queryInterface.bulkInsert('Players', MockData.players.map(player => ({
      name: player.name,
      number: player.number,
      position: player.position,
      age: player.age,
      experience: player.experience,
      height: player.height,
      weight: player.weight,
      teamId: player.teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    const accountsWithHashedPasswords = await Promise.all(
      MockData.accounts.map(async account => ({
        username: account.username,
        password: await bcrypt.hash(account.password, 10), // Wait for bcrypt.hash() to finish
        teamId: account.teamId,
        role: account.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    // Insert Accounts with hashed passwords
    await queryInterface.bulkInsert('Accounts', accountsWithHashedPasswords);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accounts', null, {});
    await queryInterface.bulkDelete('Players', null, {});
    await queryInterface.bulkDelete('Teams', null, {});
  }
};
