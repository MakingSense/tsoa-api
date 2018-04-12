'use strict';

const uuidv4 = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        _id: uuidv4(),
        email: 'dgeslin@makingsense.com',
        name: 'Daniel',
        nickname: 'dgeslin',
        avatar: 'https://s.gravatar.com/avatar/eef7ac03735857933c6a32351d1855ae?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdg.png',
        picture: 'https://s.gravatar.com/avatar/eef7ac03735857933c6a32351d1855ae?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdg.png',
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.or]: ['dgeslin@makingsense.com'] }
    }, {});
  }
};
