import { expect } from 'chai';

import * as ioc from '../../../ioc';
import { generateMockUUID, generateUserModel } from '../../data/models';
import { BaseService } from '../../../services/BaseService';
import { MockBaseRepository } from '../mocks/MockBaseRepository';

/** we need some of this stuff on runtime */
ioc; // tslint:disable-line

class BaseServiceExtension extends BaseService<any> {
  protected repository = new MockBaseRepository();
}

describe('BaseService', () => {
  let service: BaseService<any>;
  beforeEach(() => {
    service = new BaseServiceExtension();
  });

  it('should getPaginated', async () => {
    const res = await service.getPaginated(1, 100, null, null, null);
    expect(res).to.have.property('count');
    expect(res).to.have.property('page');
    expect(res).to.have.property('limit');
    expect(res).to.have.property('totalPages');
    expect(res).to.have.property('docs');
    expect(res.docs).to.have.length.greaterThan(0);
  });

  it('should getById', async () => {
    const res = await service.getById(generateMockUUID());
    expect(res).to.have.property('id');
    expect(res).to.have.property('_id');
  });

  it('should create', async () => {
    const model = generateUserModel();
    const res = await service.create(model);
    expect(res).to.have.property('id');
    expect(res).to.have.property('_id');
  });

  it('should update', async () => {
    const res = await service.update(generateMockUUID(), generateUserModel());
    expect(res).to.have.property('id');
    expect(res).to.have.property('_id');
  });

  it('should delete', async () => {
    const res = await service.delete(generateMockUUID());
    expect(res).to.equal(undefined);
  });
});
