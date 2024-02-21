"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tour.hasMany(models.Calendar, {
        sourceKey: "id",
        foreignKey: "ID_Tour",
      });

      Tour.hasOne(models.ProcessTour, {
        sourceKey: "id",
        foreignKey: "ID_Tour",
      });

      Tour.hasMany(models.ViewedTour, {
        sourceKey: "id",
        foreignKey: "ID_Tour", 
      });
       
    }
  }
  Tour.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      priceAdult: DataTypes.INTEGER,
      priceChild: DataTypes.INTEGER,
      duration: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.STRING,
      vehicle: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Tour",
    }
  );
  return Tour;
};
