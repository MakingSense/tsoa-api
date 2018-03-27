import { IUserModel } from '../../models';

export class MockUserRepository {
  public async find(query: string): Promise<IUserModel[]> {
    return Promise.resolve([
      {
        "id": "5ab949feb9b98029d5b5b660",
        "username": "dgeslin2",
        "firstName": "daniel",
        "lastName": "geslin"
      }
    ])
  }

  public async findOne(id: string): Promise<IUserModel> {
    return Promise.resolve({
      "id": "5ab949feb9b98029d5b5b660",
      "username": "dgeslin2",
      "firstName": "daniel",
      "lastName": "geslin"
    });
  }

  public async count(query: any): Promise<number> {
    return Promise.resolve(1);
  }
}