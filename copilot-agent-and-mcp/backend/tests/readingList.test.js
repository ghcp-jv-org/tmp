const request = require('supertest');
const fs = require('fs');
const path = require('path');

// generated-by-copilot: Mock the app creation function
function createApp() {
  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const jwt = require('jsonwebtoken');
  
  const app = express();
  const SECRET_KEY = 'test_jwt_secret';
  
  app.use(cors());
  app.use(bodyParser.json());
  
  const booksFile = path.join(__dirname, '..', 'data', 'test-books.json');
  const usersFile = path.join(__dirname, '..', 'data', 'test-users.json');
  
  function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  }
  function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
  
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  
  const createApiRouter = require('../routes');
  app.use('/api', createApiRouter({
    usersFile,
    booksFile,
    readJSON,
    writeJSON,
    authenticateToken,
    SECRET_KEY
  }));
  
  return app;
}

// generated-by-copilot: Test data setup and teardown
let app;
let testToken;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'test_jwt_secret';

// generated-by-copilot: Read book IDs from test data for dynamic assertions
const testBooksFile = path.join(__dirname, '..', 'data', 'test-books.json');
const testUsersFile = path.join(__dirname, '..', 'data', 'test-users.json');
let bookIds;

beforeEach(() => {
  // generated-by-copilot: Ensure user1 and user2 exist in test data
  const users = JSON.parse(fs.readFileSync(testUsersFile, 'utf-8'));
  if (!users.find(u => u.username === 'user1')) {
    users.push({ username: 'user1', password: 'testpass', favorites: [], readingList: {} });
  }
  if (!users.find(u => u.username === 'user2')) {
    users.push({ username: 'user2', password: 'testpass', favorites: [], readingList: {} });
  }
  // generated-by-copilot: Reset user1 readingList for test isolation
  const user1 = users.find(u => u.username === 'user1');
  user1.readingList = {};
  const user2 = users.find(u => u.username === 'user2');
  user2.readingList = {};
  fs.writeFileSync(testUsersFile, JSON.stringify(users, null, 2));

  const books = JSON.parse(fs.readFileSync(testBooksFile, 'utf-8'));
  bookIds = books.map(b => String(b.id));

  app = createApp();
  // generated-by-copilot: Create a test token
  testToken = jwt.sign({ username: 'user1' }, SECRET_KEY);
});

describe('Reading List API', () => {
  describe('GET /api/reading-lists', () => {
    test('should return user reading list with book details', async () => {
      const response = await request(app)
        .get('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(200);
      // generated-by-copilot: Response is paginated with data array
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/reading-lists');
      
      expect(response.status).toBe(401);
    });
    
    test('should return 403 for invalid token', async () => {
      const response = await request(app)
        .get('/api/reading-lists')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(403);
    });
  });
  
  describe('POST /api/reading-lists', () => {
    test('should add book to reading list with valid data', async () => {
      const response = await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          bookId: bookIds[0],
          status: 'want-to-read'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Book added to reading list');
      expect(response.body.book).toHaveProperty('readingStatus', 'want-to-read');
    });
    
    test('should reject invalid status', async () => {
      const response = await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          bookId: bookIds[0],
          status: 'invalid-status'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Invalid status');
    });
    
    test('should reject missing fields', async () => {
      const response = await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ bookId: bookIds[0] });
      
      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Book ID and status are required');
    });
    
    test('should reject nonexistent book', async () => {
      const response = await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          bookId: 'nonexistent-999',
          status: 'want-to-read'
        });
      
      expect(response.status).toBe(404);
      expect(response.body.error.message).toContain('Book not found');
    });
    
    test('should set dateFinished for finished status', async () => {
      const response = await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          bookId: bookIds[1],
          status: 'finished'
        });
      
      expect(response.status).toBe(201);
      // generated-by-copilot: Verify the book was added with finished status
      const getResponse = await request(app)
        .get('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`);
      
      const finishedBook = getResponse.body.data.find(book => String(book.id) === bookIds[1]);
      expect(finishedBook.readingStatus).toBe('finished');
      expect(finishedBook.dateFinished).toBeTruthy();
    });
  });
  
  describe('PUT /api/reading-lists/:bookId', () => {
    beforeEach(async () => {
      // generated-by-copilot: Add a book to reading list for testing updates
      await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          bookId: bookIds[2],
          status: 'want-to-read'
        });
    });
    
    test('should update reading status', async () => {
      const response = await request(app)
        .put(`/api/reading-lists/${bookIds[2]}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ status: 'currently-reading' });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Reading status updated');
    });
    
    test('should set dateFinished when moving to finished', async () => {
      const response = await request(app)
        .put(`/api/reading-lists/${bookIds[2]}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ status: 'finished' });
      
      expect(response.status).toBe(200);
    });
    
    test('should reject invalid status', async () => {
      const response = await request(app)
        .put(`/api/reading-lists/${bookIds[2]}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ status: 'invalid-status' });
      
      expect(response.status).toBe(400);
    });
    
    test('should return 404 for book not in reading list', async () => {
      const response = await request(app)
        .put('/api/reading-lists/nonexistent-999')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ status: 'finished' });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /api/reading-lists/:bookId', () => {
    beforeEach(async () => {
      // generated-by-copilot: Add a book to reading list for testing deletion
      await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          bookId: bookIds[3],
          status: 'want-to-read'
        });
    });
    
    test('should remove book from reading list', async () => {
      const response = await request(app)
        .delete(`/api/reading-lists/${bookIds[3]}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      // generated-by-copilot: DELETE returns 204 No Content
      expect(response.status).toBe(204);
    });
    
    test('should return 404 for book not in reading list', async () => {
      const response = await request(app)
        .delete('/api/reading-lists/nonexistent-999')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('User isolation', () => {
    test('users should not see each other\'s reading lists', async () => {
      // generated-by-copilot: Create token for different user
      const user2Token = jwt.sign({ username: 'user2' }, SECRET_KEY);
      
      // generated-by-copilot: Add book to user1's reading list
      await request(app)
        .post('/api/reading-lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          bookId: bookIds[4],
          status: 'want-to-read'
        });
      
      // generated-by-copilot: Check that user2 doesn't see user1's books
      const response = await request(app)
        .get('/api/reading-lists')
        .set('Authorization', `Bearer ${user2Token}`);
      
      expect(response.status).toBe(200);
      const user1Book = response.body.data.find(book => String(book.id) === bookIds[4]);
      expect(user1Book).toBeUndefined();
    });
  });
});