// generated-by-copilot: Jest test fixture for books API endpoints
const request = require('supertest');
const express = require('express');
const createApiRouter = require('../routes');
const path = require('path');
const fs = require('fs');

const usersFile = path.join(__dirname, '../data/test-users.json');
const booksFile = path.join(__dirname, '../data/test-books.json');

// generated-by-copilot: Create Express app with test configuration
const app = express();
app.use(express.json());
app.use('/api', createApiRouter({
  usersFile,
  booksFile,
  readJSON: (file) => fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf-8'))
    : [],
  writeJSON: (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2)),
  authenticateToken: (req, res, next) => next(),
  SECRET_KEY: 'test_secret',
}));

// generated-by-copilot: Clean invalid favorite IDs so stats test is consistent
beforeAll(() => {
  const books = JSON.parse(fs.readFileSync(booksFile, 'utf-8'));
  const validIds = new Set(books.map(b => String(b.id)));
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  let changed = false;
  users.forEach(u => {
    if (u.favorites && Array.isArray(u.favorites)) {
      const cleaned = u.favorites.filter(id => validIds.has(String(id)));
      if (cleaned.length !== u.favorites.length) {
        u.favorites = cleaned;
        changed = true;
      }
    }
  });
  if (changed) fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
});

// generated-by-copilot: Error test app with failing readJSON
const errorApp = express();
errorApp.use(express.json());
errorApp.use('/api', createApiRouter({
  usersFile,
  booksFile,
  readJSON: () => { throw new Error('File read error'); },
  writeJSON: (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2)),
  authenticateToken: (req, res, next) => next(),
  SECRET_KEY: 'test_secret',
}));

describe('Books API', () => {

  // --- GET /api/books ---

  describe('GET /api/books', () => {
    // generated-by-copilot: Test paginated response structure
    it('should return a paginated list of books', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body).toHaveProperty('_links');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    // generated-by-copilot: Test meta fields in paginated response
    it('should include correct pagination meta', async () => {
      const res = await request(app).get('/api/books?page=1&limit=5');
      expect(res.statusCode).toBe(200);
      expect(res.body.meta).toHaveProperty('page', 1);
      expect(res.body.meta).toHaveProperty('limit', 5);
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('pages');
      expect(res.body.meta).toHaveProperty('hasNext');
      expect(res.body.meta).toHaveProperty('hasPrev');
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    // generated-by-copilot: Test second page of results
    it('should return the correct page when paginating', async () => {
      const res = await request(app).get('/api/books?page=2&limit=5');
      expect(res.statusCode).toBe(200);
      expect(res.body.meta.page).toBe(2);
      expect(res.body.meta.hasPrev).toBe(true);
    });

    // generated-by-copilot: Test HATEOAS links on each book
    it('should include HATEOAS links on each book', async () => {
      const res = await request(app).get('/api/books?page=1&limit=3');
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(book => {
        expect(book).toHaveProperty('_links');
        expect(book._links).toHaveProperty('self');
        expect(book._links.self.href).toContain(`/api/v1/books/${book.id}`);
        expect(book._links).toHaveProperty('favorite');
      });
    });

    // generated-by-copilot: Test rate limit headers
    it('should include rate limit headers', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.headers['x-ratelimit-limit']).toBe('1000');
      expect(res.headers['x-ratelimit-remaining']).toBe('999');
    });

    // generated-by-copilot: Test filtering by author (uses first author from test data)
    it('should filter books by author', async () => {
      const books = JSON.parse(fs.readFileSync(booksFile, 'utf-8'));
      const testAuthor = books[0].author.split(' ').pop(); // use last name
      const res = await request(app).get(`/api/books?author=${encodeURIComponent(testAuthor)}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      res.body.data.forEach(book => {
        expect(book.author.toLowerCase()).toContain(testAuthor.toLowerCase());
      });
    });

    // generated-by-copilot: Test filtering returns empty when no match
    it('should return empty data when author filter has no match', async () => {
      const res = await request(app).get('/api/books?author=NonExistentAuthor12345');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.meta.total).toBe(0);
    });

    // generated-by-copilot: Test sorting by title ascending
    it('should sort books by title ascending', async () => {
      const res = await request(app).get('/api/books?sort=title&limit=100');
      expect(res.statusCode).toBe(200);
      const titles = res.body.data.map(b => b.title.toLowerCase());
      const sorted = [...titles].sort();
      expect(titles).toEqual(sorted);
    });

    // generated-by-copilot: Test sorting by title descending
    it('should sort books by title descending', async () => {
      const res = await request(app).get('/api/books?sort=-title&limit=100');
      expect(res.statusCode).toBe(200);
      const titles = res.body.data.map(b => b.title.toLowerCase());
      const sorted = [...titles].sort().reverse();
      expect(titles).toEqual(sorted);
    });

    // generated-by-copilot: Test sorting by author ascending
    it('should sort books by author ascending', async () => {
      const res = await request(app).get('/api/books?sort=author&limit=100');
      expect(res.statusCode).toBe(200);
      const authors = res.body.data.map(b => b.author.toLowerCase());
      const sorted = [...authors].sort();
      expect(authors).toEqual(sorted);
    });

    // generated-by-copilot: Test sorting by author descending
    it('should sort books by author descending', async () => {
      const res = await request(app).get('/api/books?sort=-author&limit=100');
      expect(res.statusCode).toBe(200);
      const authors = res.body.data.map(b => b.author.toLowerCase());
      const sorted = [...authors].sort().reverse();
      expect(authors).toEqual(sorted);
    });

    // generated-by-copilot: Test default pagination limits
    it('should use default pagination when no params provided', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(20);
    });

    // generated-by-copilot: Test that total matches actual book count
    it('should return total matching actual book count', async () => {
      const books = JSON.parse(fs.readFileSync(booksFile, 'utf-8'));
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.body.meta.total).toBe(books.length);
    });

    // generated-by-copilot: Test JSON content type
    it('should return JSON content type', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
    });
  });

  // --- GET /api/books/:id ---

  describe('GET /api/books/:id', () => {
    // generated-by-copilot: Test that GET /books/:id returns 404 (endpoint not implemented)
    it('should return 404 for a valid book id (endpoint not implemented)', async () => {
      const res = await request(app).get('/api/books/1');
      expect(res.statusCode).toBe(404);
    });

    // generated-by-copilot: Test that GET /books/:id returns 404 for nonexistent id
    it('should return 404 for a nonexistent book id', async () => {
      const res = await request(app).get('/api/books/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  // --- POST /api/books (not allowed) ---

  describe('POST /api/books', () => {
    // generated-by-copilot: Test that adding books is not allowed per business rules
    it('should not be allowed', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ title: 'Test Book', author: 'Test Author' });
      expect([404, 405]).toContain(res.statusCode);
    });
  });

  // --- Error cases ---

  describe('Error handling', () => {
    // generated-by-copilot: Test 500 when readJSON throws on GET /books
    it('should return 500 when file read fails on GET /api/books', async () => {
      const res = await request(errorApp).get('/api/books');
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('INTERNAL_ERROR');
      expect(res.body.error.message).toBe('Failed to retrieve books');
    });

    // generated-by-copilot: Test 500 when readJSON throws on GET /books/stats
    it('should return 500 when file read fails on GET /api/books/stats', async () => {
      const res = await request(errorApp).get('/api/books/stats');
      expect(res.statusCode).toBe(500);
    });

    // generated-by-copilot: Test empty dataset returns valid paginated response
    it('should handle empty book list gracefully', async () => {
      const emptyApp = express();
      emptyApp.use(express.json());
      emptyApp.use('/api', createApiRouter({
        usersFile,
        booksFile,
        readJSON: () => [],
        writeJSON: (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2)),
        authenticateToken: (req, res, next) => next(),
        SECRET_KEY: 'test_secret',
      }));

      const res = await request(emptyApp).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.meta.total).toBe(0);
    });
  });

  // --- GET /api/books/stats ---

  describe('GET /api/books/stats', () => {
    // generated-by-copilot: Test successful response with correct data structure
    it('should return stats with correct structure', async () => {
      const res = await request(app).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalBooks');
      expect(res.body).toHaveProperty('favoritedBooks');
      expect(typeof res.body.totalBooks).toBe('number');
      expect(typeof res.body.favoritedBooks).toBe('number');
      expect(res.body.totalBooks).toBeGreaterThanOrEqual(0);
      expect(res.body.favoritedBooks).toBeGreaterThanOrEqual(0);
    });

    // generated-by-copilot: Test calculation correctness with actual data
    it('should calculate correct total books count', async () => {
      const books = JSON.parse(fs.readFileSync(booksFile, 'utf-8'));
      const res = await request(app).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.totalBooks).toBe(books.length);
    });

    // generated-by-copilot: Test favorited books calculation
    it('should calculate correct favorited books count', async () => {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      const uniqueFavorites = new Set();

      users.forEach(user => {
        if (user.favorites && Array.isArray(user.favorites)) {
          user.favorites.forEach(bookId => uniqueFavorites.add(String(bookId)));
        }
      });

      const res = await request(app).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.favoritedBooks).toBe(uniqueFavorites.size);
    });

    // generated-by-copilot: Test that favorites count is never greater than total books
    it('should never have more favorited books than total books', async () => {
      const res = await request(app).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.favoritedBooks).toBeLessThanOrEqual(res.body.totalBooks);
    });

    // generated-by-copilot: Test no authentication required
    it('should not require authentication', async () => {
      const res = await request(app).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalBooks');
      expect(res.body).toHaveProperty('favoritedBooks');
    });

    // generated-by-copilot: Test response headers
    it('should return JSON content type', async () => {
      const res = await request(app).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    // generated-by-copilot: Test handling users with missing favorites array
    it('should handle users without favorites array', async () => {
      const tempApp = express();
      tempApp.use(express.json());
      tempApp.use('/api', createApiRouter({
        usersFile,
        booksFile,
        readJSON: (file) => {
          if (file === usersFile) {
            return [{ username: 'userNoFavorites', password: 'pass' }];
          }
          return JSON.parse(fs.readFileSync(file, 'utf-8'));
        },
        writeJSON: (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2)),
        authenticateToken: (req, res, next) => next(),
        SECRET_KEY: 'test_secret',
      }));

      const res = await request(tempApp).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.favoritedBooks).toBe(0);
      expect(typeof res.body.totalBooks).toBe('number');
    });

    // generated-by-copilot: Test handling empty data files
    it('should handle empty data files', async () => {
      const emptyApp = express();
      emptyApp.use(express.json());
      emptyApp.use('/api', createApiRouter({
        usersFile,
        booksFile,
        readJSON: () => [],
        writeJSON: (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2)),
        authenticateToken: (req, res, next) => next(),
        SECRET_KEY: 'test_secret',
      }));

      const res = await request(emptyApp).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.totalBooks).toBe(0);
      expect(res.body.favoritedBooks).toBe(0);
    });
  });
});
