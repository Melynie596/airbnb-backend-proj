'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review,
        {foreignKey: 'reviewId'}
        );
    }
  }
  ReviewImage.init({
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
      },
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};
