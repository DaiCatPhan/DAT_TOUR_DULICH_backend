"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CancellationRequests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // BookingTour.belongsTo(models.Calendar, {
      //   foreignKey: "idCalendar",
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
  CancellationRequests.init(
    {
      ID_BookingTour: DataTypes.INTEGER,

      reason: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CancellationRequests",
    }
  );
  return CancellationRequests;
};
