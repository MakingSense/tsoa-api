import { decorate, injectable } from 'inversify';

import constants from '../config/constants';
import { ApiError } from '../config/ErrorHandler';
import { PaginationModel } from '../models';
import { IBaseRepository } from '../repositories/IBaseRepository';

export abstract class BaseService<EntityModel> {
  protected repository: IBaseRepository<EntityModel>;

  public async getById(_id: string): Promise<EntityModel> {
    return this.repository.findOne({ _id });
  }

  public async getPaginated(
    page: number,
    limit: number,
    fields: string,
    sort: string,
    query: string
  ): Promise<PaginationModel> {
    const skip: number = (Math.max(1, page) - 1) * limit;
    let [count, docs] = await Promise.all([
      this.repository.count(query),
      this.repository.find(skip, limit, sort, query)
    ]);
    const fieldArray = (fields || '').split(',').map(field => field.trim()).filter(Boolean);
    if (fieldArray.length) docs = docs.map(d => {
      const attrs: any = {};
      fieldArray.forEach(f => attrs[f] = d[f]);
      return attrs;
    });
    return new PaginationModel({
      count,
      page,
      limit,
      docs,
      totalPages: Math.ceil(count / limit),
    });
  }

  public async create(entity: EntityModel): Promise<EntityModel> {
    const res = await this.repository.create(entity);
    return this.getById((res as any)._id);
  }

  public async update(id: string, entity: EntityModel): Promise<EntityModel> {
    await this.repository.update(id, entity);
    return this.getById(id);
  }

  public async delete(id: string): Promise<void> {
    const res = await this.repository.delete(id);
    if (!res.n) throw new ApiError(constants.errorTypes.notFound);
  }
}

decorate(injectable(), BaseService);
