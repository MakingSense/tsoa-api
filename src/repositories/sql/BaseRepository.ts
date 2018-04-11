import * as Sequelize from 'sequelize';
import { decorate, injectable } from 'inversify';

import { IBaseRepository } from '../IBaseRepository';
import { ApiError } from '../../config/ErrorHandler';
import constants from '../../config/constants';
import { cleanQuery, safeParse, isId } from '../../utils';
import { BaseEntity } from './entities/BaseEntity';

export abstract class BaseRepository<EntityType> implements IBaseRepository<EntityType> {
  protected formatter: any = Object;
  protected entityModel: BaseEntity;
  protected getInclude: Sequelize.IncludeOptions[] = [];
  protected saveInclude: Sequelize.IncludeOptions[] = [];

  public async create(model: EntityType, include = this.saveInclude): Promise<EntityType> {
    const res = await this.entityModel.model.create(this.cleanToSave(model), { include });
    return new this.formatter(res);
  }

  public async update(_id: string, model: EntityType, include = this.saveInclude): Promise<void> {
    await this.entityModel.model.update(this.cleanToSave(model), { where: { _id } });
  }

  public async delete(_id: string): Promise<{ n: number }> {
    const n = await this.entityModel.model.destroy({ where: { _id } });
    return { n };
  }

  public async find(
    offset: number = 0,
    limit: number = 250,
    sort: string,
    query: any,
    include = this.getInclude
  ): Promise<EntityType[]> {
    const sortObject = this.cleanSort(sort);
    const order = Object.keys(sortObject).map(key => [key, sortObject[key]]);
    const where = this.cleanWhere(query);
    const options: Sequelize.FindOptions<any> = {
      include,
      where,
      limit,
      offset
    };
    if (order) options.order = order;
    return (await this.entityModel.model.findAll(options))
      .map(item => new this.formatter(item));
  }

  public async findOne<T>(where: any, include = this.getInclude): Promise<EntityType> {
    const res = await this.entityModel.model.findOne({ where, include });
    if (!res) throw new ApiError(constants.errorTypes.notFound);
    return new this.formatter(res);
  }

  public async count(query: any): Promise<number> {
    return this.entityModel.model.count({ where: this.cleanWhere(query) });
  }

  protected cleanToSave(entity: any): any {
    const copy: any = new this.formatter(entity);
    const loop = (value: any): any => {
      if (!value || typeof value !== 'object') return;
      /** formatting logic to save goes here */
      Object.keys(value).forEach(key => loop(value[key]));
    };
    loop(copy);
    return copy;
  }

  protected sortQueryFormatter(key: string, value: string): string | undefined {
    if (value === 'asc') return 'asc';
    if (value === 'desc') return 'desc';
    return undefined; // just for static typing
  }

  protected whereQueryFormatter = (key: string, value: any): any => {
    value = safeParse(value, value);
    if (value instanceof Array) return {
      [Sequelize.Op.or]: value.map(v => this.whereQueryFormatter(key, v))
    };
    else if (isId(key)) return { [Sequelize.Op.eq]: value };
    else if (typeof value === 'string') return { [Sequelize.Op.like]: `%${value}%` };
    else return { [Sequelize.Op.eq]: value };
  }

  protected cleanSort(sort: string): { [key: string]: any } {
    return cleanQuery(sort, this.sortQueryFormatter);
  }

  protected cleanWhere(query: any): { [key: string]: any } {
    return cleanQuery(query, this.whereQueryFormatter);
  }
}

decorate(injectable(), BaseRepository);
