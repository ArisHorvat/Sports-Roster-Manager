'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { Team, Player, Account } = require('../models');

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'ST'];
const ROLES = ['user', 'admin'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create teams
    const teamCount = 100;
    const playerCount = 1_000;
    const accountCount = 1_000;

    const teams = [];
    for (let i = 0; i < teamCount; i++) {
      teams.push({ teamName: faker.company.name(), createdAt: new Date(), updatedAt: new Date() });
    }
    await queryInterface.bulkInsert('Teams', teams);

    // Retrieve all team IDs
    const teamIds = await queryInterface.sequelize.query(
      'SELECT id FROM "Teams"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ).then(teams => teams.map(t => t.id));

    // Create players
    const players = [];
    for (let i = 0; i < playerCount; i++) {
      players.push({
        name: faker.person.fullName(),
        number: faker.number.int({ min: 0, max: 99 }),
        position: faker.helpers.arrayElement(POSITIONS),
        age: faker.number.int({ min: 18, max: 40 }),
        experience: faker.number.int({ min: 0, max: 20 }),
        height: faker.number.int({ min: 160, max: 220 }),
        weight: faker.number.int({ min: 50, max: 150 }),
        teamId: faker.helpers.arrayElement(teamIds),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('Players', players);

    // Create accounts
    const accounts = [];
    const promises = [];

    for (let i = 0; i < accountCount; i++) {
      const username = `user${i + 6}`;
      const plainPassword = faker.internet.password();
      const role = faker.helpers.arrayElement(ROLES);
      const teamId = faker.helpers.arrayElement(teamIds);

      // Push a promise for bcrypt hashing
      promises.push(
        bcrypt.hash(plainPassword, 10).then((hashedPassword) => ({
          username,
          password: hashedPassword,
          role,
          teamId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }

    // Wait for all hashing to complete
    const hashedAccounts = await Promise.all(promises);

    // Now bulk insert
    await queryInterface.bulkInsert('Accounts', hashedAccounts);

    console.log('Seeding completed.');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accounts', null, {});
    await queryInterface.bulkDelete('Players', null, {});
    await queryInterface.bulkDelete('Teams', null, {});
  }
};
