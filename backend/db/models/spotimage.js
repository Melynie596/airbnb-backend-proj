'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class spotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      spotImage.belongsTo(models.spot);
    }
  }
  spotImage.init({
    id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    spotId: DataTypes.INTEGER,
    preview: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'spotImage',
  });
  return spotImage;
};
