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

      admin_approval: { type: Sequelize.DATE }, // Ngày admin xác nhận đơn đặt tour
      status: { type: Sequelize.STRING }, //  Chờ xác nhận, Đã xác nhận, Hủy bỏ

      createdAt: { type: Sequelize.DATE }, // Ngày khách hàng đặt tour
      updatedAt: { type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BookingTours");
  },
};
