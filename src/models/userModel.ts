export interface IUserModel {
  id: string;
  name: string;
}

export class UserModel implements IUserModel {
  public id: string = null;
  public name: string = null;

  constructor(args: any) {
    if (!args) throw new Error(`${UserModel.name}'s args are missing`);
    Object.keys(this).forEach(key => {
      if (args[key] !== undefined) this[key] = args[key];
    });
  }
}
