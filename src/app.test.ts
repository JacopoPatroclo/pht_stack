import { describe, it, after, before } from 'node:test';
import { strict as assert } from 'node:assert';
import { build } from './app';
import type { FastifyInstance } from 'fastify';
import type { makeSqlClient } from './database';

// Here you can mock the Sql client as you like
const mockSqlClient = {};

// This is an example test
// you can test the all application if you like
// or you can test the single routes
describe('app', () => {
  let app: FastifyInstance;

  before(() => {
    app = build({
      sqlClient: mockSqlClient as ReturnType<typeof makeSqlClient>,
      env: {
        ENVIROMENT: 'test',
        DATABASE_URL: 'not really necessary',
      },
    });
  });

  it('homepage', async () => {
    const resp = await app.inject({
      url: '/',
      method: 'GET',
    });

    assert.equal(resp.statusCode, 200, 'status code should be 200');
    assert.ok(resp.body.includes('Hello'), "response should include 'Hello'");
  });

  after(async () => {
    await app.close();
  });
});
