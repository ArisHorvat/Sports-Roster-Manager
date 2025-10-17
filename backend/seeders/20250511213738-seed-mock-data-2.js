'use strict';

const { MockData } = require('../src/MockData.cjs');
const bcrypt = require('bcrypt');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  const accounts = [
      { username: 'admin4', password: 'adminpass', teamId: 4, role: 'admin' }, 
      { username: 'admin5', password: 'adminpass', teamId: 5, role: 'admin' }, 
  ]

    const accountsWithHashedPasswords = await Promise.all(
      accounts.map(async account => ({
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
