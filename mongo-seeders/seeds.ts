import { iocContainer } from '../src/ioc';
import { UserRepository } from '../src/repositories/mongo/UserRepository';

const userRepository = iocContainer.get<UserRepository>(UserRepository);

(async () => {
  console.log('== mongo: migrating =======');
  console.time('== mongo: migrated =======');
  const users = [
    {
      email: 'dgeslin@makingsense.com',
      name: 'Daniel',
      nickname: 'dgeslin',
      avatar: 'https://s.gravatar.com/avatar/eef7ac03735857933c6a32351d1855ae?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdg.png', // tslint:disable-line
      picture: 'https://s.gravatar.com/avatar/eef7ac03735857933c6a32351d1855ae?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdg.png', // tslint:disable-line
      gender: 'male',
      firstname: 'Daniel',
      lastname: 'Geslin'
    }
  ];
  
  await Promise.all(users.map(u => userRepository.create(u)));

  console.timeEnd('== mongo: migrated =======');
  process.exit();
})();
