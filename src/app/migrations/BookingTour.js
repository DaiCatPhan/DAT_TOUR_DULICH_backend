"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BookingTours", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ID_Calendar: { type: Sequelize.INTEGER },
      ID_Customer: { type: Sequelize.INTEGER },

      numberTicketAdult: { type: Sequelize.INTEGER },
      numberTicketChild: { type: Sequelize.INTEGER },

      total_money: { type: Sequelize.INTEGER },
      payment_status: { type: Sequelize.STRING },

      admin_approval: { type: Sequelize.STRING }, // admin duyệt
      cancellation_requested: { type: Sequelize.STRING }, // trạng thái hủy tour của khách
      cancellation_reason: { type: Sequelize.TEXT }, // lí do hủy tour của khách
      cancellation_date: { type: Sequelize.DATE }, // ngày hủy tour

      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BookingTours");
  },
};
