import { ProvideSingleton, inject } from '../ioc';
import { UserModel } from '../models';

@ProvideSingleton(UserRepository)
export class UserRepository {

  public async find(query: string): Promise<UserModel[]> {
    const randomArray = Array.from(Array(Math.round((Math.random() * 10))));
    return createMockResponse(randomArray.map(() => createMockItem()));
  }

  public async findOne(id: string): Promise<UserModel> {
    return createMockResponse(createMockItem());
  }
}

function createMockItem(): UserModel {
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
