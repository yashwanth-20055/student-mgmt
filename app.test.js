const request = require('supertest');
const app = require('./app');

test('GET /health returns UP', async () => {
  const r = await request(app).get('/health');
  expect(r.status).toBe(200);
  expect(r.body.status).toBe('UP');
});

test('unknown route returns 404', async () => {
  const r = await request(app).get('/nope');
  expect(r.status).toBe(404);
});