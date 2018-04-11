import { generate } from 'randomstring';

import * as Models from '../../models';

export const generateMockUUID = (): string => {
  return `${generate(8)}-${generate(4)}-${generate(4)}-${generate(4)}-${generate(12)}`;
};

export const generateUserModel = (): Models.IUserModel => ({
  email: generate(20),
  name: generate(20)
});
