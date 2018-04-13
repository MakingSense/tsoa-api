import * as Sequelize from 'sequelize';

export default {
  up: async (queryInterface: Sequelize.QueryInterface) => {
    return Promise.all([
      // queryInterface.addColumn('users', 'fakeColumn', Sequelize.STRING)
    ]);
  },
  down: async (queryInterface: Sequelize.QueryInterface) => {
    return Promise.all([
      // queryInterface.removeColumn('users', 'fakeColumn')
    ]);
  }
};
