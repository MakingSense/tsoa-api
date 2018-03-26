import { ProvideSingleton, inject } from '../ioc';
import { UserModel } from '../models';
import { UserRepository } from '../repositories';

@ProvideSingleton(GetUserUseCase)
export class GetUserUseCase {

  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  public async getById(id: string): Promise<UserModel> {
    return this.userRepository.findOne(id);
  }

  public async find(query: string): Promise<UserModel[]> {
    return this.userRepository.find(query);
  }
}
