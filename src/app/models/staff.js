"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Staff.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
      address: DataTypes.STRING,
      avatar: DataTypes.STRING,
      status: DataTypes.STRING,
      password: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Staff",
    }
  );
  return Staff;
};
