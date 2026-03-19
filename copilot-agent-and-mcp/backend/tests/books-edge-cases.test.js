// generated-by-copilot: Jest test fixture for edge-case book data
const request = require('supertest');
const express = require('express');
const createApiRouter = require('../routes');
const path = require('path');
const fs = require('fs');

// generated-by-copilot: Use production data files which contain seeded edge-case books
const usersFile = path.join(__dirname, '../data/users.json');
const booksFile = path.join(__dirname, '../data/books.json');

// generated-by-copilot: Load seeded books for assertion reference
const seededBooks = JSON.parse(fs.readFileSync(booksFile, 'utf-8'));

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

describe('Books API – Edge-Case Data', () => {

  // --- Special characters in titles ---

  describe('Special characters in titles', () => {
    // generated-by-copilot: Test that titles with apostrophes and plus signs are returned intact
    it('should return books with apostrophes and special chars in title', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const book = res.body.data.find(b => b.title.includes("O'Reilly"));
      expect(book).toBeDefined();
      expect(book.title).toBe("O'Reilly's Guide to C++");
    });

    // generated-by-copilot: Test that titles with embedded double quotes are preserved
    it('should return books with embedded double quotes in title', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const book = res.body.data.find(b => b.title.includes('Quoted'));
      expect(book).toBeDefined();
      expect(book.title).toBe('"Quoted Title"');
    });

    // generated-by-copilot: Test that Unicode / non-ASCII titles are returned correctly
    it('should return books with Unicode characters in title', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const book = res.body.data.find(b => b.title === '日本語タイトル');
      expect(book).toBeDefined();
      expect(book.title).toBe('日本語タイトル');
    });

    // generated-by-copilot: Test that single-character title is handled
    it('should return a book with a single-character title', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const book = res.body.data.find(b => b.title === 'A');
      expect(book).toBeDefined();
      expect(book.title).toBe('A');
      expect(book.title.length).toBe(1);
    });

    // generated-by-copilot: Test HATEOAS links still work for special-char titles
    it('should include valid HATEOAS links for special-char books', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const specialBooks = res.body.data.filter(b =>
        b.title.includes("'") || b.title.includes('"') || b.title === '日本語タイトル'
      );
      expect(specialBooks.length).toBeGreaterThanOrEqual(3);

      specialBooks.forEach(book => {
        expect(book._links).toBeDefined();
        expect(book._links.self.href).toBe(`/api/v1/books/${book.id}`);
        expect(book._links.favorite.href).toBe('/api/v1/favorites');
      });
    });
  });

  // --- Boundary years ---

  describe('Boundary years (1900, 2025)', () => {
    // generated-by-copilot: Test that a book with year 1900 is present and correct
    it('should return a book with the minimum boundary year 1900', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const book = res.body.data.find(b => b.year === 1900);
      expect(book).toBeDefined();
      expect(book.year).toBe(1900);
      expect(typeof book.year).toBe('number');
    });

    // generated-by-copilot: Test that a book with year 2025 is present and correct
    it('should return a book with the maximum boundary year 2025', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const book = res.body.data.find(b => b.year === 2025);
      expect(book).toBeDefined();
      expect(book.year).toBe(2025);
      expect(typeof book.year).toBe('number');
    });

    // generated-by-copilot: Test that all book years are valid numbers
    it('should have numeric year values for every book', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      res.body.data.forEach(book => {
        expect(typeof book.year).toBe('number');
        expect(Number.isInteger(book.year)).toBe(true);
      });
    });

    // generated-by-copilot: Test year range across the dataset
    it('should have years within a reasonable range', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const years = res.body.data.map(b => b.year);
      expect(Math.min(...years)).toBe(1900);
      expect(Math.max(...years)).toBeLessThanOrEqual(2025);
    });
  });

  // --- Very long title strings ---

  describe('Very long title strings', () => {
    // generated-by-copilot: Test that a book with a very long title is returned
    it('should return a book with a 200-character title', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const longBook = res.body.data.find(b => b.title.length >= 200);
      expect(longBook).toBeDefined();
      expect(longBook.title.length).toBe(200);
    });

    // generated-by-copilot: Test that the long title is returned without truncation
    it('should return the long title without truncation', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      const expected = seededBooks.find(b => b.title.length >= 200);
      const actual = res.body.data.find(b => b.id === expected.id);
      expect(actual).toBeDefined();
      expect(actual.title).toBe(expected.title);
      expect(actual.title.length).toBe(expected.title.length);
    });

    // generated-by-copilot: Test that pagination still works when long titles are present
    it('should paginate correctly with long-title books in dataset', async () => {
      const res = await request(app).get('/api/books?page=1&limit=2');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.meta.total).toBe(seededBooks.length);
      expect(res.body.meta.pages).toBe(Math.ceil(seededBooks.length / 2));
    });

    // generated-by-copilot: Test JSON content type is correct even with long strings
    it('should return valid JSON even with very long title values', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
      expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow();
    });
  });

  // --- Sorting edge cases ---

  describe('Sorting with edge-case titles', () => {
    // generated-by-copilot: Test that sorting by title handles special characters correctly
    it('should sort titles including special chars without errors', async () => {
      const res = await request(app).get('/api/books?sort=title&limit=100');
      expect(res.statusCode).toBe(200);
      const titles = res.body.data.map(b => b.title.toLowerCase());
      const sorted = [...titles].sort();
      expect(titles).toEqual(sorted);
    });

    // generated-by-copilot: Test descending sort with edge-case data
    it('should sort titles descending with edge-case data', async () => {
      const res = await request(app).get('/api/books?sort=-title&limit=100');
      expect(res.statusCode).toBe(200);
      const titles = res.body.data.map(b => b.title.toLowerCase());
      const sorted = [...titles].sort().reverse();
      expect(titles).toEqual(sorted);
    });
  });

  // --- Filtering edge cases ---

  describe('Filtering with edge-case data', () => {
    // generated-by-copilot: Test filtering by author that has special characters in assigned book title
    it('should filter by author and return edge-case book', async () => {
      const res = await request(app).get('/api/books?author=Harper+Lee&limit=100');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      res.body.data.forEach(book => {
        expect(book.author.toLowerCase()).toContain('harper lee');
      });
    });

    // generated-by-copilot: Test that filtering with special characters in query doesn't break
    it('should handle special characters in filter query params', async () => {
      const res = await request(app).get("/api/books?author=O'Brien&limit=100");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // --- Data integrity ---

  describe('Data integrity for edge-case books', () => {
    // generated-by-copilot: Test that all seeded edge-case books appear in API response
    it('should return all seeded books without data loss', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);
      expect(res.body.meta.total).toBe(seededBooks.length);

      seededBooks.forEach(seeded => {
        const found = res.body.data.find(b => b.id === seeded.id);
        expect(found).toBeDefined();
        expect(found.title).toBe(seeded.title);
        expect(found.author).toBe(seeded.author);
        expect(found.year).toBe(seeded.year);
      });
    });

    // generated-by-copilot: Test that every book has required fields
    it('should have required fields on every book', async () => {
      const res = await request(app).get('/api/books?limit=100');
      expect(res.statusCode).toBe(200);

      res.body.data.forEach(book => {
        expect(book).toHaveProperty('id');
        expect(book).toHaveProperty('title');
        expect(book).toHaveProperty('author');
        expect(book).toHaveProperty('year');
        expect(book).toHaveProperty('_links');
      });
    });

    // generated-by-copilot: Test stats endpoint counts edge-case books correctly
    it('should count edge-case books in stats', async () => {
      const res = await request(app).get('/api/books/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.totalBooks).toBe(seededBooks.length);
    });
  });
});
