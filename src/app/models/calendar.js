"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Calendar.belongsTo(models.Tour, {
        foreignKey: "ID_Tour",
        targetKey: "id",
      });

      Calendar.hasMany(models.BookingTour, {
        foreignKey: "ID_Calendar",
        sourceKey: "id",
      });
    }
  }
  Calendar.init(
    {
      ID_Tour: DataTypes.INTEGER,
      numberSeat: DataTypes.STRING,
      priceAdult: DataTypes.STRING,
      priceChild: DataTypes.STRING,
      status: DataTypes.STRING,
      startDay: DataTypes.DATE,
      endDay: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Calendar",
    }
  );
  return Calendar;
};
