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

      numberTicketAdult: { type: Sequelize.STRING },
      numberTicketChild: { type: Sequelize.STRING },

      amount_paid: { type: Sequelize.INTEGER },
      payment_status: { type: Sequelize.INTEGER },
      
      admin_approval : { type: Sequelize.STRING }, // admin duyệt
      cancellation_requested  : { type: Sequelize.STRING }, // trạng thái hủy đơn hang của khách
      cancellation_date  : { type: Sequelize.STRING }, // ngày hủy đơn hàng 

      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BookingTours");
  },
};