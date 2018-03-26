import { Route, Controller, Get, Put, Post, Delete, Security, Query, Body } from 'tsoa';

import { ProvideSingleton, inject } from '../ioc';
import { IUserModel, UserModel, PaginationModel } from '../models';
import { safeParse } from '../utils';
import { GetUserUseCase, CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase } from '../useCases';

@Route('user')
@ProvideSingleton(UserController)
export class UserController extends Controller {
  constructor(
    @inject(GetUserUseCase) private getUserUseCase: GetUserUseCase,
    @inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
    @inject(UpdateUserUseCase) private updateUserUseCase: UpdateUserUseCase,
    @inject(DeleteUserUseCase) private deleteUserUseCase: DeleteUserUseCase
  ) {
    super();
  }

  @Get('{id}')
  public async getById(id: string): Promise<IUserModel> {
    return this.getUserUseCase.getById(id);
  }

  @Get()
  public async getPaginated(
    @Query('query') query: string,
    @Query('pageNumber') pageNumber: number,
    @Query('perPage') perPage: number): Promise<PaginationModel> {
    return this.getUserUseCase.getPaginated(safeParse(query, {}), pageNumber, perPage);
  }

  @Post()
  @Security('adminUser')
  public async create(@Body() userParams: IUserModel): Promise<IUserModel> {
    const user = new UserModel(userParams);
    return this.createUserUseCase.execute(user);
  }

  @Put('{id}')
  @Security('adminUser')
  public async update(id: string, @Body() userParams: IUserModel): Promise<{ count: number }> {
    const user = new UserModel(userParams);
    return this.updateUserUseCase.execute(id, user);
  }

  @Delete('{id}')
  @Security('adminUser')
  public async delete(id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
