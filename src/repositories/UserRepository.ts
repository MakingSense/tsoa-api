import { Schema, Model, Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { ProvideSingleton, inject } from '../ioc';
import { DbConnection } from '../config/DbConnection';
import { UserModel, IUserModel } from '../models';
import { cleanQuery } from '../utils';

@ProvideSingleton(UserRepository)
export class UserRepository {
  public userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  });
  public model: Model<Document> = this.dbConnection.db.model('users', this.userSchema);

  constructor(@inject(DbConnection) private dbConnection: DbConnection) {
    this.userSchema.plugin(uniqueValidator);
  }

  public async create(userModel: IUserModel): Promise<Document> {
    return this.model.create(userModel);
  }

  public async update(_id: string, userModel: IUserModel): Promise<{ ok: number }> {
    return this.model.updateOne({ _id }, userModel);
  }

  public async delete(_id: string): Promise<void> {
    return this.model.deleteOne({ _id });
  }

  public async find(query: IUserModel, skip: number = 0, limit: number = 250): Promise<Document[]> {
    return this.model.find(cleanQuery(query)).skip(skip).limit(limit);
  }

  public async findOne(query: any): Promise<Document> {
    return this.model.findOne(cleanQuery(query));
  }

  public async count(query: any): Promise<number> {
    return this.model.count(cleanQuery(query));
  }
}
