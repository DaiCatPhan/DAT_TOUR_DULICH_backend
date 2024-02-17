"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CancellationRequests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ID_BookingTour: { type: Sequelize.INTEGER },

      reason: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING }, //  Chờ xác nhận, Đã xác nhận, Hủy bỏ

      createdAt: { type: Sequelize.DATE }, // Ngày khách hàng đặt tour
      updatedAt: { type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CancellationRequests");
  },
};
