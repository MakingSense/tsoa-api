import { expect } from 'chai';
import * as supertest from 'supertest';

import { ROOT_PATH } from '../constants';
import { Server } from '../../config/Server';
import { generateUserModel } from '../data/models';
import { IntegrationHelper } from '../IntegrationHelper';

const route: string = `${ROOT_PATH}/users`;
const entityName: string = 'user';

describe(`${route}`, () => {
  const app = supertest(new Server().app);
  const integrationHelper: IntegrationHelper = new IntegrationHelper(app);
  let model = generateUserModel();

  describe('POST', () => {
    it(`should create: ${entityName}`, async () => {
      const res = await app.post(route).send(model);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('email');
      model = res.body;
    });
    it(`should FAIL to create: ${entityName}`, async () => {
      const res = await app.post(route).send({});
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /{id}', () => {
    it(`should update: ${entityName}`, async () => {
      model.name = `${model.name}_edited`;
      const res = await app.put(`${route}/${model.id}`).send(model);
      expect(res.status).to.equal(200);
      model = res.body;
    });
    it(`should FAIL to update: ${entityName}`, async () => {
      const res = await app.put(`${route}/${model.id}`).send({});
      expect(res.status).to.equal(400);
    });
  });

  describe('GET', () => {
    it(`should get paginated: ${entityName}`, async () => {
      const res = await app.get(
        `${route}?page=1&limit=1&sort={"email":"asc"}&fields=email&q={"email":"${model.email}"}`
      );
      integrationHelper.testPagination(res);
    });
    it(`should FAIL to get paginated: ${entityName}`, async () => {
      const res = await app.get(route);
      expect(res.status).to.equal(400);
    });
  });

  describe('GET /{id}', () => {
    it(`should get one: ${entityName}`, async () => {
      const res = await app.get(`${route}/${model.id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(model);
    });
    it(`should FAIL to get one: ${entityName}`, async () => {
      const res = await app.get(`${route}/11111111-1111-1111-1111-111111111111`);
      expect(res.status).to.satisfy(val => val === 404 || val === 500);
    });
  });

  describe('DELETE /{id}', () => {
    it(`should delete one: ${entityName}`, async () => {
      const res = await app.delete(`${route}/${model.id}`);
      expect(res.status).to.equal(204);
    });
    it(`should FAIL to delete one: ${entityName}`, async () => {
      const res = await app.delete(`${route}/${model.id}`);
      expect(res.status).to.equal(404);
    });
  });
});
