import { decorate, injectable } from 'inversify';
import * as Sequelize from 'sequelize';

import { SQLDbConnection } from '../../../config/SQLDbConnection';
import { Logger } from '../../../config/Logger';

export abstract class BaseEntity {
  public entityName: string;
  public model: Sequelize.Model<any, any>;
  protected sqlDbConnection: SQLDbConnection;
  protected attributes: Sequelize.DefineAttributes;
  protected options: Sequelize.DefineOptions<any>;

  protected initModel(): void {
    this.model = this.sqlDbConnection.db.define(this.entityName, this.attributes, this.options);
  }

  protected sync(options?: Sequelize.SyncOptions): Promise<any> {
    Logger.log(
      `synchronizing: ${this.entityName}${options ? ` with options: ${JSON.stringify(options)}` : ''}`
    );
    return this.model.sync(options) as any;
  }
}

decorate(injectable(), BaseEntity);
