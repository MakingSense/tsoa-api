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
