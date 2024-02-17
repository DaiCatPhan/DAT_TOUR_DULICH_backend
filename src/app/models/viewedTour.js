"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ViewedTour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // viewedTour.belongsTo(models.ProcessTour, {
      //   foreignKey: "ID_ProcessTour",
      //   targetKey: "id",
      // });
    }
  }
  ViewedTour.init(
    {
      ID_Customer: DataTypes.INTEGER,
      ID_Tour: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ViewedTour",
    }
  );
  return ViewedTour;
};
