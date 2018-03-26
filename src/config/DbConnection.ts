import * as mongoose from 'mongoose';

import constants from './constants';
import { ProvideSingleton, inject } from '../ioc';

@ProvideSingleton(DbConnection)
export class DbConnection {
  public db: mongoose.Connection
  private connectionString: string = constants.mongoConnectionString;

  constructor() {
    this.db = mongoose.createConnection(this.connectionString);
  }
}
