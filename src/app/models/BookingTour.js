"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookingTour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // BookingTour.belongsTo(models.Calendar, {
      //   foreignKey: "ID_Calendar",
      //   targetKey: "id",
      // });
      // BookingTour.belongsTo(models.Customer, {
      //   foreignKey: "idCustomer",
      //   targetKey: "id",
      // });
      // BookingTour.belongsTo(models.Staff, {
      //   foreignKey: "idStaff",
      //   targetKey: "id",
      // });
    }
  }
  BookingTour.init(
    {
      ID_Calendar: DataTypes.INTEGER,
      ID_Customer: DataTypes.INTEGER,
      ID_Voucher: DataTypes.INTEGER,

      numberTicketAdult: DataTypes.INTEGER,
      numberTicketChild: DataTypes.INTEGER,

      total_money: DataTypes.INTEGER,
      paid_money: DataTypes.INTEGER,
      remaining_money: DataTypes.INTEGER,
      payment_status: DataTypes.STRING,

      status: DataTypes.STRING,

      cancel_booking: DataTypes.STRING,
      date_cancel_booking: DataTypes.DATE,
      reason_cancel_booking: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BookingTour",
    }
  );
  return BookingTour;
};
