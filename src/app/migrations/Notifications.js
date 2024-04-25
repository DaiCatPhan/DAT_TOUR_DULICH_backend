"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      ID_Customer: { type: Sequelize.INTEGER },

      title: { type: Sequelize.STRING },
      contentHTML: { type: Sequelize.TEXT },
      contentTEXT: { type: Sequelize.TEXT },

      read: { type: Sequelize.STRING },

      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Notifications");
  },
};
