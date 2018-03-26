import { expect } from 'chai';

import { GetUserUseCase } from '../../useCases';
import { UserModel } from '../../models';
import { MockUserRepository } from '../mocks/mockUserRepository'

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';
describe('GetItemsUseCase', () => {
  let useCase: GetUserUseCase;
  beforeEach(() => {
    useCase = new GetUserUseCase(new MockUserRepository() as any);
  });

  it('should find many', async () => {
    const results = await useCase.find('');
    expect(results.length).to.be.greaterThan(0);
  });

  it('should get by id', async () => {
    const results = await useCase.getById('')
    expect(!!results).to.equal(true);
  });
});
