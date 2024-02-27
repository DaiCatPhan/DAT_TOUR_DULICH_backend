"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TypeVoucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TypeVoucher.init(
    {
      typeVoucher: DataTypes.STRING,
      value: DataTypes.INTEGER,
      maxValue: DataTypes.INTEGER,
      minValue: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TypeVoucher",
    }
  );
  return TypeVoucher;
};
