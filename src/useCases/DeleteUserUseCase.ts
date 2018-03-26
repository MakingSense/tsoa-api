import { ProvideSingleton, inject } from '../ioc';
import { UserModel, IUserModel } from '../models';
import { UserRepository } from '../repositories';

@ProvideSingleton(DeleteUserUseCase)
export class DeleteUserUseCase {

  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  public async execute(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
