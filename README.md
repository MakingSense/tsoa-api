# tsoa api
* This project is a seed for building a **node.js** api. It includes the following features:
* *  [tsoa](https://www.npmjs.com/package/tsoa) `typescript`
* * [inversify](https://www.npmjs.com/package/inversify) `inversion of controll / dependency injection`
* * [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* * [mongoose](https://www.npmjs.com/package/mongoose) `MongoDB ORM`
* * mocha, chai, supertest `unit and integration testing`
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

### Model
* Models are used for 4 reasons:
* * **Swagger** definition file
* * Run time validations performed by **tsoa**
* * Static typing advantages
* * Data normalization
```typescript
/** An interface used for swagger, run time validations and standar typescript advantages */
export interface IUserModel {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
}

/** A class used to normalize data */
export class UserModel implements IUserModel {
  public id: string = null;
  public username: string = null;
  public firstName: string = null;
  public lastName: string = null;

  constructor(args: any) {
    if (!args) throw new Error('no data');
    Object.keys(this).forEach(key => {
      if (args[key] !== undefined) this[key] = args[key];
    });
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