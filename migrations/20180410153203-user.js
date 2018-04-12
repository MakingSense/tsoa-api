'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.addColumn('users', 'fakeColumn', Sequelize.STRING)
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.removeColumn('users', 'fakeColumn')
    ]);
  }
};
