# tsoa api
* This project is a seed for building a **node.js** api. It includes the following features:
* *  [tsoa](https://www.npmjs.com/package/tsoa) `typescript`
* * [inversify](https://www.npmjs.com/package/inversify) `inversion of controll / dependency injection`
* * [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* * [mongoose](https://www.npmjs.com/package/mongoose) `MongoDB ORM`
* * [sequelize](https://www.npmjs.com/package/sequelize) `SQL ORM`
* * [mocha](https://www.npmjs.com/package/mocha), [chai](https://www.npmjs.com/package/chai), [supertest](https://www.npmjs.com/package/supertest), [sinon](https://www.npmjs.com/package/sinon) `unit and integration testing`

## Swagger
* `<url>/api-docs`

## Commands
* **instalation:** `yarn install`
* **dev:** `yarn start` *build tsoa routes, swagger definitions and starts the server on development mode listening to file changes (swagger definition changes will require a manual restart)*
* **test:** `yarn test` *unit and integration tests*
* **build:** `yarn build` *production build*
* **prod:** `yarn start:prod` *starts the server on production mode*

## Scaffolding
* config `express server, DB connection, Logger, etc`
* * env `.env files`
* controllers `routes configuration`
* models `classes and interfaces representing entities. They are also used to normalize data`
* respositories `data abstraction layers`
* services `business logic to be used primary by controllers`
* utils
* tests

## Code Examples

### Controller
* Controllers handle routes configuration including:
* * paths / methods
* * auth roles
* * swagger definitions
```typescript
import { Route, Controller, Get } from 'tsoa';

import { ProvideSingleton } from '../ioc';

@Route('ping')
@ProvideSingleton(PingController)
export class PingController extends Controller {
  /** The service containing business logic is passed through dependency injection */
  constructor(@inject(UserService) private userService: UserService) {
    super();
  }

  /** Simple GET */
  @Get()
  public async ping(): Promise<string> {
    return 'pong';
  }

  /** Error response definition for swagger */
  @Response(400, 'Bad request')
  @Post()
  /** Type of security needed to access the method */
  @Security('adminUser')
  /** The request's body is accessed through a decorator */
  /** The interface "IUserModel" is also used to build swagger specs and to perform run time validations */ 
  public async create(@Body() userParams: IUserModel): Promise<IUserModel> {
    const user = new UserModel(userParams);
    return this.userService.create(user);
  }
}
```

### Models and Formatters
* Models and Formatters are used for 4 reasons:

#### Model
* * **Swagger** definition file
* * Run time validations performed by **tsoa**
* * Static typing advantages
```typescript
/** An interface used for swagger, run time validations and standar typescript advantages */
export interface IUserModel {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
}
```

#### Formatter
* * Data normalization
```typescript
/** A class used to normalize data */
export class UserFormatter extends BaseFormatter implements IUserModel {
  public username: string = undefined;
  public firstName: string = undefined;
  public lastName: string = undefined;

  constructor(args: any) {
    super();
    this.format(args);
  }
}
```

### Auth
* A simple **tsoa** middleware to handle authentication by decorators.
#### Auth on controller
```typescript
class SomeController {
  @Post()
  @Security('authRole')
  public async method(): Promise<IUserModel> {
    // ...
  }
}
```
#### Auth logic implementation
```typescript
export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<AuthData> {
  /** Switch to handle security decorators on controllers - @Security('adminUser') */
  switch (securityName) {
    case 'authRole':
      /** If auth is valid, returns data that might be used on controllers (maybe logged user's data) */
      return null;
  }
  /** Throws an exception if auth is invalid */
  throw new ApiError('auth', 403, 'invalid credentials');
}
```

### Service
* Services encapsulate buisness logic to be used by controllers. This allows the code to stay **DRY** if several controllers rely on similar logic and help to make testing easier.
```typescript
@ProvideSingleton(UserService)
export class UserService {
  /** The repository to access the data persistance layer is passed through dependency injection */
  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  /** Business logic to get a single item */
  public async getById(_id: string): Promise<IUserModel> {
    return new UserModel(await this.userRepository.findOne({ _id }));
  }

  /** Business logic to get paginated data */
  public async getPaginated(query: IUserModel, pageNumber: number, perPage: number): Promise<PaginationModel> {
    const skip: number = (Math.max(1, pageNumber) - 1) * perPage;
    const [count, list] = await Promise.all([
      this.userRepository.count(query),
      this.userRepository.find(query, skip, perPage)
    ]);
    return new PaginationModel({
      count,
      pageNumber,
      perPage,
      list: list.map(item => new UserModel(item))
    });
  }
}
```

### Repositories
* Repositories handle the access to data layers

#### Mongo Repository 
```typescript
@ProvideSingleton(UserService)
import { Schema, Model } from 'mongoose';

import { BaseRepository } from './BaseRepository';
import { ProvideSingleton, inject } from '../../ioc';
import { MongoDbConnection } from '../../config/MongoDbConnection';
import { ICaseModel, CaseFormatter } from '../../models';

@ProvideSingleton(CaseRepository)
export class CaseRepository extends BaseRepository<ICaseModel> {
  protected modelName: string = 'cases';
  protected schema: Schema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: String, required: true }
  });
  protected formatter = CaseFormatter;
  constructor(@inject(MongoDbConnection) protected dbConnection: MongoDbConnection) {
    super();
    super.init();
  }
}
```

#### SQL Repository 
```typescript
import { ProvideSingleton, inject } from '../../ioc';
import { BaseRepository } from './BaseRepository';
import { ICaseModel, CaseFormatter } from '../../models';
import { CaseEntity } from './entities';

@ProvideSingleton(CaseRepository)
export class CaseRepository extends BaseRepository<ICaseModel> {
  protected formatter: any = CaseFormatter;

  constructor(@inject(CaseEntity) protected entityModel: CaseEntity) {
    super();
  }
}
```

#### SQL Entity
* * Sequelize definition to be used by SQL repositories
```typescript
import * as Sequelize from 'sequelize';

import { ProvideSingleton, inject } from '../../../ioc';
import { SQLDbConnection } from '../../../config/SQLDbConnection';
import { BaseEntity } from './BaseEntity';

@ProvideSingleton(CaseEntity)
export class CaseEntity extends BaseEntity {
  /** table name */
  public entityName: string = 'case';
  /** table definition */  
  protected attributes: Sequelize.DefineAttributes = {
    _id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    createdBy: { type: Sequelize.STRING, allowNull: false }
  };
  protected options: Sequelize.DefineOptions<any> = { name: { plural: 'cases' } };

  constructor(@inject(SQLDbConnection) protected sqlDbConnection: SQLDbConnection) {
    super();
    this.initModel();
  }
}
```

#### SQL Migrations
* * When an update on a model is needed, the `Entity` on `src/repositories/sql/entities` will have to be updated and a migration file created and run with the provided npm script `migrate:<env>` to update the already created table.
```typescript
import * as Sequelize from 'sequelize';

export default {
  up: async (queryInterface: Sequelize.QueryInterface) => {
    return Promise.all([
      // queryInterface.addColumn('users', 'fakeColumn', Sequelize.STRING)
    ]);
  },
  down: async (queryInterface: Sequelize.QueryInterface) => {
    return Promise.all([
      // queryInterface.removeColumn('users', 'fakeColumn')
    ]);
  }
};
```

#### Sync
* * To sync all entities when the server/tests start, tou will have to inject their dependencies into `SQLSetupHelper` class localted at `src/config/SQLSetupHelper`
```typescript
import * as Sequelize from 'sequelize';

import constants from './constants';
import { Logger } from './Logger';
import { ProvideSingleton, inject } from '../ioc';
import { SQLDbConnection } from './SQLDbConnection';
import * as entities from '../repositories/sql/entities';

@ProvideSingleton(SQLSetupHelper)
export class SQLSetupHelper {

  constructor(
    @inject(SQLDbConnection) private sqlDbConnection: SQLDbConnection,
    @inject(entities.UserEntity) private entity1: entities.UserEntity,
    @inject(entities.CaseEntity) private entity2: entities.CaseEntity
  ) { }

  public async rawQuery<T>(query: string): Promise<T> {
    return this.sqlDbConnection.db.query(query, { raw: true });
  }

  public async sync(options?: Sequelize.SyncOptions): Promise<void> {
    await this.sqlDbConnection.db.authenticate();
    if (constants.SQL.dialect === 'mysql') await this.rawQuery('SET FOREIGN_KEY_CHECKS = 0');
    Logger.log(
      `synchronizing: tables${options ? ` with options: ${JSON.stringify(options)}` : ''}`
    );
    await this.sqlDbConnection.db.sync(options);
  }
}
```


### Test
* Tests include **unit tests** `(utils and services)` and **integration tests**.
```typescript
import { expect } from 'chai';
import * as supertest from 'supertest';

import { Server } from '../../config/Server';

describe('PingController', () => {
  const app = supertest(new Server().app);

  it('HTTP GET /api/ping | should return pong', async () => {
    const res = await app.get('/api/ping');
    expect(res.status).to.equal(200);
    expect(res.body).to.equal('pong');
  });
});

```