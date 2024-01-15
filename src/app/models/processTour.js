"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProcessTour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProcessTour.init(
    {
      ID_Tour: DataTypes.INTEGER,
      descriptionHTML: DataTypes.TEXT,
      descriptionTEXT: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ProcessTour",
    }
  );
  return ProcessTour;
};
