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
    if (!args) throw new Error(`${UserModel.name}'s args are missing`);
    Object.keys(this).forEach(key => {
      if (args[key] !== undefined) this[key] = args[key];
    });
  }
}
