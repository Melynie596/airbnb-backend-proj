'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'SpotImages'
   await queryInterface.bulkInsert(options, [
    {
      id: 1,
      url: 'https://media.vrbo.com/lodging/27000000/26940000/26932700/26932676/3ddcd5ab.c10.jpg',
      spotId: 1,
      preview: true
    },
    {
      id: 2,
      url: 'https://a0.muscache.com/im/pictures/0d2347bb-d67e-42a2-92af-c2d1a3364322.jpg',
      spotId: 2,
      preview: true
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2]}
    }, {})
  }
};
