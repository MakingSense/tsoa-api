import {
  Route,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Security,
  Query,
  Body,
  Response,
  Tags
} from 'tsoa';

import { ProvideSingleton, inject } from '../ioc';
import { IUserModel, IPaginationModel } from '../models';
import { UserService } from '../services';

@Tags('users')
@Route('users')
@ProvideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(UserService) private service: UserService) {
    super();
  }

  @Get('{id}')
  public async getById(id: string): Promise<IUserModel> {
    return this.service.getById(id);
  }

  @Get()
  public async getPaginated(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('fields') fields?: string,
    @Query('sort') sort?: string,
    @Query('q') q?: string): Promise<IPaginationModel> {
    return this.service.getPaginated(page, limit, fields, sort, q);
  }

  @Response(400, 'Bad request')
  @Security('admin')
  @Post()
  public async create(@Body() body: IUserModel): Promise<IUserModel> {
    return this.service.create(body);
  }

  @Response(400, 'Bad request')
  @Security('admin')
  @Put('{id}')
  public async update(id: string, @Body() body: IUserModel): Promise<IUserModel> {
    return this.service.update(id, body);
  }

  @Security('admin')
  @Delete('{id}')
  public async delete(id: string): Promise<void> {
    return this.service.delete(id);
  }
}
