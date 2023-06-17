'use strict';
const { Model, Validator } = require('sequelize');
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
      Spot.hasMany(models.Review,
        {foreignKey: 'spotId'});
      Spot.hasMany(models.Booking,
        {foreignKey: 'spotId'});
      Spot.belongsTo(models.User,
          {foreignKey: 'id'}
        );
      Spot.hasMany(models.spotImage,
        {foreignKey: 'spotId'});
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: {
      type: DataTypes.FLOAT
    },
    lng:  {
      type: DataTypes.FLOAT
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    previewImage: DataTypes.STRING,
    avgRating: {
      type: DataTypes.FLOAT
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
