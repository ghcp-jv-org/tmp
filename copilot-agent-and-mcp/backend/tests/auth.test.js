const request = require('supertest');
const express = require('express');
const createApiRouter = require('../routes');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/api', createApiRouter({
  usersFile: path.join(__dirname, '../data/test-users.json'),
  booksFile: path.join(__dirname, '../data/test-books.json'),
  readJSON: (file) => require('fs').existsSync(file) ? JSON.parse(require('fs').readFileSync(file, 'utf-8')) : [],
  writeJSON: (file, data) => require('fs').writeFileSync(file, JSON.stringify(data, null, 2)),
  authenticateToken: (req, res, next) => next(),
  SECRET_KEY: 'test_secret',
}));

describe('Auth API', () => {
  const testUser = { username: 'testuser', password: 'testpass' };

  // generated-by-copilot: POST /api/users (formerly /api/register)
  it('POST /api/users should fail with missing fields', async () => {
    const res = await request(app).post('/api/users').send({ username: '' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/users should succeed with valid data', async () => {
    const res = await request(app).post('/api/users').send(testUser);
    // 201 or 409 if already exists
    expect([201, 409]).toContain(res.statusCode);
  });

  it('POST /api/users should fail if user already exists', async () => {
    await request(app).post('/api/users').send(testUser); // ensure exists
    const res = await request(app).post('/api/users').send(testUser);
    expect(res.statusCode).toBe(409);
  });

  // generated-by-copilot: POST /api/auth/tokens (formerly /api/login)
  it('POST /api/auth/tokens should succeed with correct credentials', async () => {
    await request(app).post('/api/users').send(testUser); // ensure exists
    const res = await request(app).post('/api/auth/tokens').send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/tokens should fail with wrong password', async () => {
    const res = await request(app).post('/api/auth/tokens').send({ username: testUser.username, password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/auth/tokens should fail with missing fields', async () => {
    const res = await request(app).post('/api/auth/tokens').send({ username: '' });
    expect(res.statusCode).toBe(400);
  });
});
