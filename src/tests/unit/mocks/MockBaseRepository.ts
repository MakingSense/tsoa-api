import { IBaseRepository } from '../../../repositories/IBaseRepository';
import { generateMockUUID, generateUserModel } from '../../data/models';

export class MockBaseRepository implements IBaseRepository<any> {
  constructor(public mock?: any) { }

  public async create(model: any): Promise<any> {
    const id = generateMockUUID();
    return this.mock || { ...model, id, _id: id };
  }

  public async update(_id: string, model: any): Promise<void> {
    return null;
  }

  public async delete(_id: string): Promise<{ n: number }> {
    return { n: 1 };
  }

  public async find(skip?: number, limit?: number, sort?: string, query?: any): Promise<any[]> {
    const id = generateMockUUID();
    return [this.mock || { ...generateUserModel(), id, _id: id }];
  }

  public async findOne(query: any): Promise<any[]> {
    const id = generateMockUUID();
    return this.mock || { ...generateUserModel(), id, _id: id };
  }

  public async count(query: any): Promise<number> {
    return 1;
  }
}
