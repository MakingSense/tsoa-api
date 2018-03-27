import constants from '../config/constants';
import { ApiError } from '../config/ErrorHandler';

export interface IUserModel {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
}

export class UserModel implements IUserModel {
  public id: string = null;
  public username: string = null;
  public firstName: string = null;
  public lastName: string = null;

  constructor(args: any) {
    if (!args) throw new ApiError(constants.errorTypes.entity);
    Object.keys(this).forEach(key => {
      if (args[key] !== undefined) this[key] = args[key];
    });
  }
}
