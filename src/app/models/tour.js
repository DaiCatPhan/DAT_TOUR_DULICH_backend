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
    }
  }
  Tour.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      domain: DataTypes.STRING,
      priceAdult: DataTypes.INTEGER,
      priceChild: DataTypes.INTEGER,
      price_Include: DataTypes.TEXT,
      price_NotInclude: DataTypes.TEXT,
      duration: DataTypes.STRING,
      descriptionHTML: DataTypes.TEXT,
      descriptionTEXT: DataTypes.TEXT,
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
