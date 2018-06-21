import { expect } from 'chai';
import { SuperTest } from 'supertest';

import { iocContainer } from '../ioc';
import { SQLSetupHelper } from '../config/SQLSetupHelper';
import { ROOT_PATH } from './constants';

export type Response<T> = Promise<{
  status: number;
  body: T;
}>;

export class IntegrationHelper {
  public app: SuperTest<any>;
  public rootPath: string = ROOT_PATH;
  public loginPath: string = `${this.rootPath}/auth/login`;
  public userPath: string = `${this.rootPath}/users`;
  public channelPath: string = `${this.rootPath}/channels`;
  public messagePath: string = `${this.rootPath}/messages`;

  public static setup(): void {
    xit('SQL DB', async () => {
      const sqlHelper = iocContainer.get<SQLSetupHelper>(SQLSetupHelper);
      await sqlHelper.sync({ force: true });
      expect(1).to.equal(1);
    });
  }

  constructor(app: SuperTest<any>) {
    this.app = app;
  }

  public testPagination(res: any): void {
    expect(res.status).to.equal(200);
    expect(res.body.count).to.be.greaterThan(0);
    expect(res.body.page).to.be.equal(1);
    expect(res.body.limit).to.equal(1);
    expect(res.body.totalPages).to.be.greaterThan(0);
    expect(res.body.docs).to.have.length; // tslint:disable-line
  }
}