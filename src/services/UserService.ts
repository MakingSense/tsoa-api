import { ProvideSingleton, inject } from '../ioc';
import { BaseService } from './BaseService';
import { UserRepository } from '../repositories';
import { IUserModel } from '../models';

@ProvideSingleton(UserService)
export class UserService extends BaseService<IUserModel> {

  constructor(@inject(UserRepository) protected repository: UserRepository) {
    super();
  }
}
