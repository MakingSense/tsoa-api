import { expect } from 'chai';

import { UserService } from '../../services';
import { UserModel } from '../../models';
import { MockUserRepository } from '../mocks/mockUserRepository'

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';
describe('GetItemsUseCase', () => {
  let service: UserService;
  beforeEach(() => {
    service = new UserService(new MockUserRepository() as any);
  });

  it('should find many', async () => {
    const results = await service.getPaginated({} as any, 1, 5);
    expect(results.count).to.be.greaterThan(0);
    expect(results.list.length).to.be.greaterThan(0);
    expect(results.pageNumber).to.equal(1);
    expect(results.perPage).to.equal(5);
  });

  it('should get by id', async () => {
    const results = await service.getById('')
    expect(!!results).to.equal(true);
  });
});
