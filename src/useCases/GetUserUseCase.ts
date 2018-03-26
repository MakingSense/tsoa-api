import { ProvideSingleton, inject } from '../ioc';
import { IUserModel } from '../models';
import { UserRepository } from '../repositories';

@ProvideSingleton(GetUserUseCase)
export class GetUserUseCase {

  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  public async getById(id: string): Promise<IUserModel> {
    return this.userRepository.findOne(id);
  }

  public async find(query: string): Promise<IUserModel[]> {
    return this.userRepository.find(query);
  }
}
