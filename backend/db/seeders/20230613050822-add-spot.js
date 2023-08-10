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
   options.tableName = 'Spots';
   await queryInterface.bulkInsert(options, [
    { id: 1,
      ownerId: 1,
      address: '102 Winner Creek Cir',
      city: 'Anchorage',
      state: 'Alaska',
      country: 'United States',
      lat: 123.54,
      lng: -378.00,
      name: 'Cabin in the Woods',
      description: 'cute cottage in the woods to experience the true alaskan experience!',
      price: 150
    },
    { id: 2,
      ownerId: 2,
      address: '123 Fake St',
      city: 'Omaha',
      state: 'Nebraska',
      country: 'United States',
      lat: 41.25709,
      lng: -95.94109,
      name: 'Afforadable Dundee Bedroom',
      description: 'cozy 1 bedroom with peacful ambiance and affordability',
      price: 70
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
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2]}
    }, {})
  }
};
