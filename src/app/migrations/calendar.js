"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Calendars", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      ID_Tour: {
        type: Sequelize.INTEGER,
      },
      

      numberSeat: { type: Sequelize.STRING },
      priceAdult: { type: Sequelize.STRING },
      priceChild: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      startDay: { type: Sequelize.DATE },
      endDay: { type: Sequelize.DATE },

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
    await queryInterface.dropTable("Calendars");
  },
};
