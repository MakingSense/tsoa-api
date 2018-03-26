import { ProvideSingleton, inject } from '../ioc';
import { UserModel, IUserModel } from '../models';

@ProvideSingleton(UserRepository)
export class UserRepository {

  public async find(query: string): Promise<IUserModel[]> {
    const randomArray = Array.from(Array(Math.round((Math.random() * 10))));
    return createMockResponse(randomArray.map(() => createMockItem()));
  }

  public async findOne(id: string): Promise<IUserModel> {
    return createMockResponse(createMockItem());
  }
}

function createMockItem(): IUserModel {
  return new UserModel({
    id: Math.random().toString().substring(2),
    name: Math.random().toString().substring(2)
  })
}

async function createMockResponse<T>(res: T): Promise<T> {
  return new Promise<T>(resolve => {
    setTimeout(() => resolve(res), Math.random() * 50);
  });
}
