import { expect } from 'chai';
import * as supertest from 'supertest';

import { Server } from '../../config/Server';
import { UserModel } from '../../models';

describe('UserController', () => {
  const app = supertest(new Server().app);
  const user = new UserModel({
    username: Date.now().toString() + Math.random(),
    firstName: 'first name',
    lastName: 'last name'
  });

  it('HTTP POST /api/user | should create a user', async () => {
    const res = await app.post('/api/user').send(user);
    expect(res.status).to.equal(200);
    expect(typeof res.body.id).to.equal('string');
    expect(res.body.username).to.equal(user.username);
    expect(res.body.firstName).to.equal(user.firstName);
    expect(res.body.lastName).to.equal(user.lastName);
    user.id = res.body.id;
  });

  it('HTTP GET /api/user | should search paginated users', async () => {
    const res = await app.get(`/api/user?pageNumber=1&perPage=5&query={"firstName":"${user.firstName}"}`);
    expect(res.body.count).to.be.greaterThan(0);
    expect(res.body.list.length).to.be.greaterThan(0);
    expect(res.body.pageNumber).to.equal(1);
    expect(res.body.perPage).to.equal(5);
  });

  it('HTTP GET /api/user/{id} | should get by id', async () => {
    const res = await app.get(`/api/user/${user.id}`);
    expect(res.body).to.deep.equal(user);
  });

  it('HTTP PUT /api/user/{id} | should update a user', async () => {
    user.firstName = 'edited first name';
    const res = await app.put(`/api/user/${user.id}`).send(user);
    expect(res.status).to.equal(200);
    expect(res.body.count).to.equal(1);
  });

  it('HTTP DELETE /api/user/{id} | should delete a user', async () => {
    let res = await app.delete(`/api/user/${user.id}`);
    expect(res.status).to.equal(200);
    expect(!!res.body.ok).to.be.true;
    res = await app.get(`/api/user/${user.id}`);
    expect(res.status).to.equal(500);
  });
});
