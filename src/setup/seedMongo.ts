import { iocContainer } from '../ioc';
import { Logger } from '../config/Logger';
import { UserRepository } from '../repositories/mongo/UserRepository';

const userRepository = iocContainer.get<UserRepository>(UserRepository);

(async () => {
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

  try {
    Logger.log('migrating MONGO');
    const prevIds = await userRepository.find(0, 1000, '', { email: users.map(u => u.email) });
    await Promise.all(prevIds.map(p => userRepository.delete(p._id)));
    await Promise.all(users.map(u => userRepository.create(u)));
  } catch (e) {
    Logger.error(e);
    process.exit(1);
  }
  process.exit();
})();
