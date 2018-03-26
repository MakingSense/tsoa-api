import { Route, Controller, Get, Put, Post, Delete, Security, Query, Body } from 'tsoa';

import { ProvideSingleton, inject } from '../ioc';
import { IUserModel } from '../models';
import { GetUserUseCase } from '../useCases';

@Route('user')
@ProvideSingleton(UserController)
export class UserController extends Controller {

  constructor(@inject(GetUserUseCase) private getUserUseCase: GetUserUseCase) {
    super();
  }

  @Get('{id}')
  public async getById(id: string): Promise<IUserModel> {
    return this.getUserUseCase.getById(id);
  }

  @Get()
  public async get(@Query('search') search: string): Promise<IUserModel[]> {
    return this.getUserUseCase.find(search);
  }
}
