"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Customer, {
        foreignKey: "ID_User",
        targetKey: "id",
      });
    }
  }
  Message.init(
    {
      ID_User: DataTypes.INTEGER,
      ID_Room: DataTypes.INTEGER,
      text: DataTypes.INTEGER,
      unRead: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
