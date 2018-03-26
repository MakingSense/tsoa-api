import { Route, Controller, Get, Put, Post, Delete, Security, Query, Body, Response } from 'tsoa';

import { ProvideSingleton, inject } from '../ioc';
import { IUserModel, UserModel, PaginationModel } from '../models';
import { safeParse } from '../utils';
import { UserService } from '../services';

@Route('user')
@ProvideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(UserService) private userService: UserService) {
    super();
  }

  @Get('{id}')
  public async getById(id: string): Promise<IUserModel> {
    return this.userService.getById(id);
  }

  @Get()
  public async getPaginated(
    @Query('query') query: string,
    @Query('pageNumber') pageNumber: number,
    @Query('perPage') perPage: number): Promise<PaginationModel> {
    return this.userService.getPaginated(safeParse(query, {}), pageNumber, perPage);
  }

  @Response(400, 'Bad request')
  @Post()
  @Security('adminUser')
  public async create(@Body() userParams: IUserModel): Promise<IUserModel> {
    const user = new UserModel(userParams);
    return this.userService.create(user);
  }

  @Response(400, 'Bad request')
  @Put('{id}')
  @Security('adminUser')
  public async update(id: string, @Body() userParams: IUserModel): Promise<{ count: number }> {
    const user = new UserModel(userParams);
    return this.userService.update(id, user);
  }

  @Delete('{id}')
  @Security('adminUser')
  public async delete(id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
