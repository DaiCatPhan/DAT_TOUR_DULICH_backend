"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voucher.hasMany(models.VoucherUser, {
        sourceKey: "id",
        foreignKey: "ID_Voucher",
      });
    }
  }
  Voucher.init(
    {
      typeVoucher: DataTypes.STRING,
      nameVoucher: DataTypes.STRING,
      amount: DataTypes.STRING,
      value: DataTypes.INTEGER,
      fromDate: DataTypes.DATE,
      toDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Voucher",
    }
  );
  return Voucher;
};
