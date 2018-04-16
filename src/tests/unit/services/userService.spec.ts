import { expect } from 'chai';

import { UserService } from '../../../services';
import { MockBaseRepository } from '../mocks/MockBaseRepository';
import { generateUserModel } from '../../data/models';

describe('UserService', () => {
  let service: UserService;
  beforeEach(() => {
    // service = new UserService(new MockBaseRepository(generateUserModel()) as any);
  });

  it('should instantiate', async () => {
    service = new UserService(new MockBaseRepository(generateUserModel()) as any);
    expect(!!service).to.be.true; // tslint:disable-line
  });
});
