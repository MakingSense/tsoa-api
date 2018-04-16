import * as Sequelize from 'sequelize';
import * as uuidv4 from 'uuid/v4';

export default {
  up: async (queryInterface: Sequelize.QueryInterface) => {
    return queryInterface.bulkInsert('users', [
      {
        _id: uuidv4(),
        email: 'dgeslin@makingsense.com',
        name: 'Daniel',
        nickname: 'dgeslin',
        avatar: 'https://s.gravatar.com/avatar/eef7ac03735857933c6a32351d1855ae?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdg.png', // tslint:disable-line
        picture: 'https://s.gravatar.com/avatar/eef7ac03735857933c6a32351d1855ae?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdg.png', // tslint:disable-line
        gender: 'male',
        firstname: 'Daniel',
        lastname: 'Geslin',
        online: false,
        added: new Date(),
        updated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: Sequelize.QueryInterface) => {
    return queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.or]: ['dgeslin@makingsense.com'] }
    }, {});
  }
};
