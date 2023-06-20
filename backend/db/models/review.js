'use strict';
const {
  Model, DATE, Validator
} = require('sequelize');
const { Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User,
        {foreignKey: 'userId'});
      Review.belongsTo(models.Spot,
        {foreignKey: 'spotId'});
      Review.hasMany(models.ReviewImage,
        {foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true});
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER
    },
    spotId: DataTypes.INTEGER,
    review: DataTypes.TEXT,
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        len: [1, 5]
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
