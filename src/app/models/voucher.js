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
      Voucher.belongsTo(models.TypeVoucher, {
        foreignKey: "ID_Typevoucher",
        targetKey: "id",
      });
      Voucher.hasMany(models.VoucherUser, {
        sourceKey: "id",
        foreignKey: "ID_Voucher", 
      });
    }
  }
  Voucher.init(
    {
      ID_Typevoucher: DataTypes.INTEGER,
      fromDate: DataTypes.STRING,
      toDate: DataTypes.STRING,
      amount: DataTypes.STRING,
      codeVoucher: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Voucher",
    }
  );
  return Voucher;
};
