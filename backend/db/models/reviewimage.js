'use strict';
const { Model, Validator } = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class reviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reviewImage.belongsTo(models.Review,
        {foreignKey: 'reviewId'}
        );
    }
  }
  reviewImage.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    url: DataTypes.STRING,
    reviewId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Review',
        key: 'id'
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'reviewImage',
  });
  return reviewImage;
};
