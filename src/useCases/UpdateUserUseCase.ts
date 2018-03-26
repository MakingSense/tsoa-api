import { ProvideSingleton, inject } from '../ioc';
import { UserModel, IUserModel } from '../models';
import { UserRepository } from '../repositories';

@ProvideSingleton(UpdateUserUseCase)
export class UpdateUserUseCase {

  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  public async execute(id: string, user: IUserModel): Promise<{ count: number }> {
    delete user.id;
    return { count: (await this.userRepository.update(id, user)).ok };
  }
}
