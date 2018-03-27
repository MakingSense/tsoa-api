import * as mongoose from 'mongoose';

import constants from './constants';
import { Logger } from './Logger';
import { ProvideSingleton, inject } from '../ioc';

@ProvideSingleton(DbConnection)
export class DbConnection {
  public db: mongoose.Connection
  private connectionString: string = constants.mongoConnectionString;

  constructor() {
    Logger.log(`connecting to ${constants.environment} MongoDb`);
    this.db = mongoose.createConnection(this.connectionString);
  }
}
