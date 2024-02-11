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
      BookingTour.belongsTo(models.Calendar, {
        foreignKey: "idCalendar",
        targetKey: "id",
      });
      BookingTour.belongsTo(models.Customer, {
        foreignKey: "idCustomer",
        targetKey: "id",
      });
      // BookingTour.belongsTo(models.Staff, {
      //   foreignKey: "idStaff",
      //   targetKey: "id",
      // });
    }
  }
  BookingTour.init(
    {
      idCustomer: DataTypes.INTEGER,
      idCalendar: DataTypes.INTEGER,
      numberTicketAdult: DataTypes.STRING,
      numberTicketChild: DataTypes.STRING,
      money: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BookingTour",
    }
  );
  return BookingTour;
};