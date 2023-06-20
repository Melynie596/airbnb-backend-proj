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
        {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true}
        );
      Spot.hasMany(models.Booking,
        {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true}
        );
      Spot.belongsTo(models.User,
          {foreignKey: 'ownerId'}
        );
      Spot.hasMany(models.spotImage,
        {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true});
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
      type: DataTypes.INTEGER
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
    previewImage: {
      type: DataTypes.STRING,
      references: {
        model: "spotImage",
        key: 'preview'
      }
    },
    avgRating: {
      type: DataTypes.FLOAT,

    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
