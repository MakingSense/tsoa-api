import * as mongoose from 'mongoose';

import { ProvideSingleton, inject } from '../ioc';

@ProvideSingleton(DbConnection)
export class DbConnection {
  public db: mongoose.Connection
  private connectionString: string = '***';

  constructor() {
    this.db = mongoose.createConnection(this.connectionString);
  }
}
