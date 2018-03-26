import { UserModel } from '../../models';

export class MockUserRepository {
  public async find(query: string): Promise<UserModel[]> {
    return Promise.resolve([{ "id": "2062395853444694", "name": "2628170887538761" }, { "id": "697673121479554", "name": "9749171195457762" }, { "id": "9417823935024647", "name": "21749734271485655" }, { "id": "11290101136994735", "name": "7119481993806307" }, { "id": "20097528675196585", "name": "6261215130908853" }])
  }

  public async findOne(id: string): Promise<UserModel> {
    return Promise.resolve({ "id": "2062395853444694", "name": "2628170887538761" });
  }
}