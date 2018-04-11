import { decorate, injectable } from 'inversify';
import { Schema, Model, Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IBaseRepository } from '../IBaseRepository';
import { ApiError } from '../../config/ErrorHandler';
import constants from '../../config/constants';
import { MongoDbConnection } from '../../config/MongoDbConnection';
import { cleanQuery } from '../../utils';

export abstract class BaseRepository<EntityType> implements IBaseRepository<EntityType> {
  protected dbConnection: MongoDbConnection;
  protected schema: Schema;
  protected documentModel: Model<Document>;
  protected modelName: string;
  protected formatter: any = Object;
  private initiated: boolean = false;

  /** this needs to be called after the extended class super is executed */
  protected init(): void {
    if (this.initiated) return;
    this.documentModel = this.dbConnection.db.model(this.modelName, this.schema);
    this.schema.plugin(uniqueValidator);
    this.initiated = true;
  }

  public async create(model: EntityType): Promise<EntityType> {
    const document: Document = await this.documentModel.create(this.cleanToSave(model));
    return new this.formatter(document);
  }

  public async update(_id: string, model: EntityType): Promise<void> {
    await this.documentModel.updateOne({ _id }, this.cleanToSave(model));
  }

  public async delete(_id: string): Promise<{ n: number }> {
    return this.documentModel.deleteOne({ _id });
  }

  public async find(
    skip: number = 0,
    limit: number = 250,
    sort: string,
    query: any
  ): Promise<EntityType[]> {
    const sortObject = cleanQuery(sort, this.sortQueryFormatter);
    return (
      await this.documentModel
        .find(this.cleanWhereQuery(query))
        .sort(Object.keys(sortObject).map(key => [key, sortObject[key]]))
        .skip(skip)
        .limit(limit)
    )
      .map(item => new this.formatter(item));
  }

  public async findOne<T>(query: any): Promise<EntityType> {
    const document: Document = await this.documentModel.findOne(query);
    if (!document) throw new ApiError(constants.errorTypes.notFound);
    return new this.formatter(document);
  }

  public async count(query: any): Promise<number> {
    return this.documentModel.count(this.cleanWhereQuery(query));
  }

  protected cleanToSave(entity: EntityType): EntityType {
    const copy: EntityType = new this.formatter(entity);
    const loop = (value: any): any => {
      if (!value || typeof value !== 'object') return;
      /** formatting logic to save goes here */
      Object.keys(value).forEach(key => loop(value[key]));
    };
    loop(copy);
    return copy;
  }

  protected sortQueryFormatter(key: string, value: string): number | undefined {
    if (value === 'asc') return 1;
    if (value === 'desc') return -1;
    return undefined; // just for static typing
  }

  protected cleanWhereQuery(query: any): { [key: string]: any } {
    if (!query || typeof query === 'string') return cleanQuery(query);

    const newQuery = { $or: [] };
    Object.keys(query).forEach(key => {
      let value = query[key];
      if (!(value instanceof Array)) newQuery[key] = value;
      else newQuery.$or = newQuery.$or.concat(value.map(item => ({ [key]: item })));
    });
    if (!newQuery.$or.length) delete newQuery.$or;
    return newQuery;
  }
}

decorate(injectable(), BaseRepository);
