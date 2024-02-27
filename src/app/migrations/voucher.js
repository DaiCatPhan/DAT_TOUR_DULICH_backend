"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vouchers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ID_Typevoucher: {
        type: Sequelize.INTEGER,
      },
      fromDate: {
        type: Sequelize.DATE,
      },
      toDate: {
        type: Sequelize.DATE,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      codeVoucher: {
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
    await queryInterface.dropTable("Vouchers");
  },
};
