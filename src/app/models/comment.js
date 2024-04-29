"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Comment.belongsTo(models.Customer, {
        foreignKey: "ID_Customer",
        targetKey: "id",
      });

      Comment.belongsTo(models.Tour, {
        foreignKey: "ID_Tour",
        targetKey: "id",
      }); 
    }
  }
  Comment.init(
    {
      ID_Customer: DataTypes.INTEGER,
      ID_Tour: DataTypes.INTEGER,
      star: DataTypes.INTEGER,
      parentID: DataTypes.INTEGER,
      content: DataTypes.STRING,
      show: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
