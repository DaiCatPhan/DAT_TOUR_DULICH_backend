"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ID_Customer: {
        type: Sequelize.INTEGER,
      },

      ID_Tour: {
        type: Sequelize.INTEGER,
      },
      star: {
        type: Sequelize.INTEGER,
      },
      parentID: {
        type: Sequelize.INTEGER,
      },

      content: {
        type: Sequelize.STRING,
      },
      show: {
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
    await queryInterface.dropTable("Comments");
  },
};
