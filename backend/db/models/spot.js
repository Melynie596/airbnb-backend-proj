'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.review,
        {foreignKey: 'spotId'});
      Spot.hasMany(models.boooking,
        {foreignKey: 'spotId'});
      Spot.belongsTo(models.user);
      Spot.hasMany(models.spotImage,
        {foreignKey: 'spotId'});
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    ownerId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: {
      type: DataTypes.FLOAT,
      validate: {
        isNumeric: true
      }
    },
    lng:  {
      type: DataTypes.FLOAT,
      validate: {
        isNumeric: true
      }
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    previewImage: DataTypes.STRING,
    avgRating: {
      type: DataTypes.FLOAT,
      validate: {
        len: [1, 5]
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
