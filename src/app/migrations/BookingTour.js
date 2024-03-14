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
      ID_Voucher: { type: Sequelize.INTEGER },

      numberTicketAdult: { type: Sequelize.INTEGER },
      numberTicketChild: { type: Sequelize.INTEGER },

      total_money: { type: Sequelize.INTEGER }, // tổng tiền phải thanh toán
      paid_money: { type: Sequelize.INTEGER }, // số tiền đã phải thanh toán
      remaining_money: { type: Sequelize.INTEGER }, // số tiền còn lại phải thanh toán
      payment_status: { type: Sequelize.STRING }, // phương thức thanh toán

      status: { type: Sequelize.STRING }, // Trạng thái của đơn hàng

      cancel_booking: { type: Sequelize.STRING },
      date_cancel_booking: { type: Sequelize.DATE },
      reason_cancel_booking: { type: Sequelize.STRING }, 

      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BookingTours");
  },
};
