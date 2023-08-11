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
   options.tableName = 'Reviews'
   await queryInterface.bulkInsert(options, [
    {
      id: 1,
      userId: 1,
      spotId: 1,
      review: 'our stay here was beautiful!',
      stars: 5
    },
    {
      id: 2,
      userId: 2,
      spotId: 2,
      review: 'great',
      stars: 5
    },
    {
      id: 3,
      userId: 2,
      spotId: 1,
      review: 'messy',
      stars: 2
    },
    {
      id: 4,
      userId: 3,
      spotId: 1,
      review: 'cozy spot, not the greatest location',
      stars: 4
    },
    {
      id: 5,
      userId: 1,
      spotId: 2,
      review: 'saw a moose!',
      stars: 5
    },
    {
      id: 6,
      userId: 3,
      spotId: 2,
      review: 'family has a great time here',
      stars: 5
    },
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2]}
    }, {})
  }
};
