import { ProvideSingleton, inject } from '../ioc';
import { UserModel, IUserModel, PaginationModel } from '../models';
import { UserRepository } from '../repositories';

@ProvideSingleton(GetUserUseCase)
export class GetUserUseCase {

  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  public async getById(_id: string): Promise<IUserModel> {
    return new UserModel(await this.userRepository.findOne({ _id }));
  }

  public async getPaginated(query: IUserModel, pageNumber: number, perPage: number): Promise<PaginationModel> {
    const skip: number = (Math.max(1, pageNumber) - 1) * perPage;
    const [count, list] = await Promise.all([
      this.userRepository.count(query),
      this.userRepository.find(query, skip, perPage)
    ]);
    return new PaginationModel({
      count,
      pageNumber,
      perPage,
      list: list.map(item => new UserModel(item))
    });
  }
}
