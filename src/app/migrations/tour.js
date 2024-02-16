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
      price_Include_TEXT: { type: Sequelize.TEXT },
      price_Include_HTML: { type: Sequelize.TEXT },
      price_NotInclude_TEXT: { type: Sequelize.TEXT },
      price_NotInclude_HTML: { type: Sequelize.TEXT },
      duration: { type: Sequelize.STRING },
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
