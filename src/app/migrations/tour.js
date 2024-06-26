"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tours", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING },
      type: { type: Sequelize.STRING },
      priceAdult: { type: Sequelize.INTEGER },
      priceChild: { type: Sequelize.INTEGER },
      numbeOfDay: { type: Sequelize.INTEGER },
      numberOfNight: { type: Sequelize.INTEGER },
      image: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, defaultValue: 1 },
      vehicle: { type: Sequelize.STRING },

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
    await queryInterface.dropTable("Tours");
  },
};
