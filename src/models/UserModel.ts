import { BaseFormatter } from './BaseFormatter';

export interface IUserModel {
  _id?: string;
  id?: string;
  email: string;
  name: string;
}

export class UserFormatter extends BaseFormatter implements IUserModel {
  public email: string = undefined;
  public name: string = undefined;

  constructor(args: any) {
    super();
    this.format(args);
  }
}
