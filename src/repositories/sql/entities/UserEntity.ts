import * as Sequelize from 'sequelize';

import { ProvideSingleton, inject } from '../../../ioc';
import { SQLDbConnection } from '../../../config/SQLDbConnection';
import { BaseEntity } from './BaseEntity';

@ProvideSingleton(UserEntity)
export class UserEntity extends BaseEntity {
  public entityName: string = 'user';
  protected attributes: Sequelize.DefineAttributes = {
    _id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true }
  };
  protected options: Sequelize.DefineOptions<any> = { name: { plural: 'users' } };

  constructor(@inject(SQLDbConnection) protected sqlDbConnection: SQLDbConnection) {
    super();
    this.initModel();
  }
}
