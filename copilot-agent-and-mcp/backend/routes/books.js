const express = require('express');
const { 
  createErrorResponse, 
  createSuccessResponse, 
  paginate, 
  filterBooks, 
  sortBooks, 
  validatePaginationParams 
} = require('../utils/apiUtils');

function createBooksRouter({ booksFile, usersFile, readJSON, writeJSON, authenticateToken }) {
  const router = express.Router();

  // generated-by-copilot: GET /books - Paginated, filtered, and sorted book list
  router.get('/', (req, res) => {
    try {
      const { page, limit } = validatePaginationParams(req.query.page, req.query.limit);
      const { author, genre, sort } = req.query;
      
      let books = readJSON(booksFile);
      
      // generated-by-copilot: Apply filters
      const filters = {};
      if (author) filters.author = author;
      if (genre) filters.genre = genre;
      
      if (Object.keys(filters).length > 0) {
        books = filterBooks(books, filters);
      }
      
      // generated-by-copilot: Apply sorting
      if (sort) {
        books = sortBooks(books, sort);
      }
      
      // generated-by-copilot: Add HATEOAS links to each book
      const booksWithLinks = books.map(book => ({
        ...book,
        _links: {
          self: { href: `/api/v1/books/${book.id}` },
          favorite: { href: '/api/v1/favorites' }
        }
      }));
      
      // generated-by-copilot: Apply pagination
      const result = paginate(booksWithLinks, page, limit);
      
      // generated-by-copilot: Add rate limit headers
      res.set({
        'X-RateLimit-Limit': '1000',
        'X-RateLimit-Remaining': '999'
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to retrieve books')
      );
    }
  });

  // generated-by-copilot: GET /books/stats - Return total books and favorited books count with error handling
  router.get('/stats', (req, res) => {
    try {
      const books = readJSON(booksFile);
      const users = readJSON(usersFile);
      
      const totalBooks = books.length;
      
      // generated-by-copilot: Get unique favorited books across all users
      const favoritedBookIds = new Set();
      users.forEach(user => {
        if (user.favorites && Array.isArray(user.favorites)) {
          user.favorites.forEach(bookId => favoritedBookIds.add(String(bookId)));
        }
      });
      
      const favoritedBooks = favoritedBookIds.size;
      
      res.status(200).json({
        totalBooks,
        favoritedBooks
      });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to retrieve book statistics')
      );
    }
  });

  // generated-by-copilot: POST /books removed - adding books is not allowed per business rules

  return router;
}

module.exports = createBooksRouter;
