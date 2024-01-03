'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Customers', [{
      username: 'Phan Dai Cat',
      email: 'example@example.com',
      phone: '0328472724',
      address: 'Can Tho',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
     
  }
};
