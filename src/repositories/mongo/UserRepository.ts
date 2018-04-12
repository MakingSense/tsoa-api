import { Schema } from 'mongoose';

import { BaseRepository } from './BaseRepository';
import { ProvideSingleton, inject } from '../../ioc';
import { MongoDbConnection } from '../../config/MongoDbConnection';
import { IUserModel, UserFormatter } from '../../models';

@ProvideSingleton(UserRepository)
export class UserRepository extends BaseRepository<IUserModel> {
  protected modelName: string = 'users';
  protected schema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  });
  protected formatter = UserFormatter;
  constructor(@inject(MongoDbConnection) protected dbConnection: MongoDbConnection) {
    super();
    super.init();
  }
}
