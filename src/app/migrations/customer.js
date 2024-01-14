"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Customers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      username: {
        type: Sequelize.STRING,
      },

      email: {
        type: Sequelize.STRING,
      },

      phone: {
        type: Sequelize.STRING,
      },

      address: {
        type: Sequelize.STRING,
      },

      avatar: {
        type: Sequelize.STRING,
      },

      role: {
        type: Sequelize.STRING,
        defaultValue: "khách hàng",
      },

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
      },

      password: {
        type: Sequelize.STRING,
      },

      refresh_token: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Customers");
  },
};
