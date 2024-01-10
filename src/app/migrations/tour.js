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
      address: { type: Sequelize.STRING },
      domain: { type: Sequelize.STRING },
      priceAdult: { type: Sequelize.INTEGER },
      priceChild: { type: Sequelize.INTEGER },
      duration: { type: Sequelize.STRING },
      descriptionHTML: { type: Sequelize.TEXT },
      descriptionTEXT: { type: Sequelize.TEXT },
      image: { type: Sequelize.STRING },
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
