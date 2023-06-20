'use strict';
const bcrypt = require("bcryptjs");
const Sequelize = require('sequelize')

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
   options.tableName = 'bookings'
   await queryInterface.bulkInsert(options, [
    { id: 1,
      spotId: 1,
      userId: 1,
      startDate: '2023-06-13',
      endDate: '2023-06-20'
    },
    {
      id: 2,
      spotId: 2,
      userId: 2,
      startDate: '2023-07-01',
      endDate: '2023-07-10'
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
    options.tableName = 'bookings'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2]}
    }, {})
  }
};
