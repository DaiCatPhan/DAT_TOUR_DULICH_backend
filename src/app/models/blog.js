"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init(
    {
      title: DataTypes.STRING,
      shortdescription: DataTypes.STRING,
      image: DataTypes.STRING,
      contentTEXT: DataTypes.TEXT,
      contentHTML: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Blog",
    }
  );
  return Blog;
};
