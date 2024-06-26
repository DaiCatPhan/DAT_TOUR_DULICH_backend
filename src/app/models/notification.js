"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.BookingTour, {
        sourceKey: "id",
        foreignKey: "ID_BookingTour", 
      });
    }
  }
  Notification.init(
    {
      ID_Customer: DataTypes.INTEGER,
      ID_BookingTour: DataTypes.INTEGER, 
      title: DataTypes.STRING,
      contentHTML: DataTypes.TEXT,
      contentTEXT: DataTypes.TEXT,
      read: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
