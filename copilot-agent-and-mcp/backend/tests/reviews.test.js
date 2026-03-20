// generated-by-copilot: Jest test fixture for reviews API endpoints
const request = require('supertest');
const express = require('express');
const createApiRouter = require('../routes');
const path = require('path');
const fs = require('fs');

const usersFile = path.join(__dirname, '../data/test-users.json');
const booksFile = path.join(__dirname, '../data/test-books.json');
const reviewsFile = path.join(__dirname, '../data/test-reviews.json');

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'test_secret';
function getToken(username = 'user1') {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
}

const app = express();
app.use(express.json());
app.use('/api', createApiRouter({
  usersFile,
  booksFile,
  reviewsFile,
  readJSON: (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : [],
  writeJSON: (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2)),
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
      req.user = jwt.verify(token, SECRET_KEY);
      next();
    } catch {
      return res.sendStatus(403);
    }
  },
  SECRET_KEY,
}));

let testBookId;

// generated-by-copilot: Set up fresh reviews file and ensure user1 exists before each test run
beforeAll(() => {
  fs.writeFileSync(reviewsFile, JSON.stringify([], null, 2));
  const books = JSON.parse(fs.readFileSync(booksFile, 'utf-8'));
  testBookId = books[0].id;
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  if (!users.find(u => u.username === 'user1')) {
    users.push({ username: 'user1', password: 'testpass', favorites: [], readingList: {} });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  }
});

// generated-by-copilot: Reset reviews before each test to ensure isolation
beforeEach(() => {
  fs.writeFileSync(reviewsFile, JSON.stringify([], null, 2));
});

describe('Reviews API', () => {
  describe('POST /api/reviews', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({ bookId: testBookId, rating: 4, reviewText: 'Great book!' });
      expect(res.statusCode).toBe(401);
    });

    it('should submit a review successfully', async () => {
      const token = getToken('user1');
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: testBookId, rating: 5, reviewText: 'Excellent read!' });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/review submitted/i);
      expect(res.body.review).toMatchObject({
        bookId: String(testBookId),
        username: 'user1',
        rating: 5,
        reviewText: 'Excellent read!'
      });
    });

    it('should return 400 when bookId is missing', async () => {
      const token = getToken('user1');
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 3, reviewText: 'Nice' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 when rating is missing', async () => {
      const token = getToken('user1');
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: testBookId, reviewText: 'Nice' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 when rating is out of range', async () => {
      const token = getToken('user1');
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: testBookId, rating: 6, reviewText: 'Great' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 404 for a non-existent book', async () => {
      const token = getToken('user1');
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: 'nonexistent', rating: 4, reviewText: 'Good' });
      expect(res.statusCode).toBe(404);
    });

    it('should return 409 when user already reviewed the book', async () => {
      const token = getToken('user1');
      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: testBookId, rating: 4, reviewText: 'First review' });
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: testBookId, rating: 3, reviewText: 'Second review' });
      expect(res.statusCode).toBe(409);
    });
  });

  describe('GET /api/reviews/:bookId', () => {
    it('should return empty list when no reviews exist', async () => {
      const res = await request(app).get(`/api/reviews/${testBookId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should return reviews for a book', async () => {
      const token = getToken('user1');
      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: testBookId, rating: 4, reviewText: 'Good book' });

      const res = await request(app).get(`/api/reviews/${testBookId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].rating).toBe(4);
    });

    it('should return 404 for a non-existent book', async () => {
      const res = await request(app).get('/api/reviews/nonexistent');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/reviews/:bookId/average', () => {
    it('should return null average when no reviews exist', async () => {
      const res = await request(app).get(`/api/reviews/${testBookId}/average`);
      expect(res.statusCode).toBe(200);
      expect(res.body.averageRating).toBeNull();
      expect(res.body.reviewCount).toBe(0);
    });

    it('should return correct average rating', async () => {
      const token1 = getToken('user1');
      const token2 = getToken('user2');

      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token1}`)
        .send({ bookId: testBookId, rating: 4, reviewText: 'Good' });
      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token2}`)
        .send({ bookId: testBookId, rating: 2, reviewText: 'Okay' });

      const res = await request(app).get(`/api/reviews/${testBookId}/average`);
      expect(res.statusCode).toBe(200);
      expect(res.body.averageRating).toBe(3);
      expect(res.body.reviewCount).toBe(2);
    });

    it('should return 404 for a non-existent book', async () => {
      const res = await request(app).get('/api/reviews/nonexistent/average');
      expect(res.statusCode).toBe(404);
    });
  });
});
