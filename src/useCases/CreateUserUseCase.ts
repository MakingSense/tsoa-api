import { ProvideSingleton, inject } from '../ioc';
import { UserModel, IUserModel } from '../models';
import { UserRepository } from '../repositories';

@ProvideSingleton(CreateUserUseCase)
export class CreateUserUseCase {

  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  public async execute(user: IUserModel): Promise<IUserModel> {
    delete user.id;
    return new UserModel(await this.userRepository.create(user));
  }
}
