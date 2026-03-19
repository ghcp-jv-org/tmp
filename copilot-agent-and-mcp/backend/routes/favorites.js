const express = require('express');
const { 
  createErrorResponse, 
  createSuccessResponse, 
  paginate, 
  validatePaginationParams 
} = require('../utils/apiUtils');

function createFavoritesRouter({ usersFile, booksFile, readJSON, writeJSON, authenticateToken }) {
  const router = express.Router();

  // generated-by-copilot: GET /favorites - Paginated user favorites with error handling
  router.get('/', authenticateToken, (req, res) => {
    try {
      const { page, limit } = validatePaginationParams(req.query.page, req.query.limit);
      
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === req.user.username);
      
      if (!user) {
        return res.status(404).json(
          createErrorResponse('USER_NOT_FOUND', 'User not found')
        );
      }
      
      const books = readJSON(booksFile);
      const favorites = books.filter(b => 
        user.favorites && user.favorites.indexOf(String(b.id)) !== -1
      );
      
      // generated-by-copilot: Add HATEOAS links to favorite books
      const favoritesWithLinks = favorites.map(book => ({
        ...book,
        _links: {
          self: { href: `/api/v1/books/${book.id}` },
          remove: { href: `/api/v1/favorites/${book.id}` }
        }
      }));
      
      // generated-by-copilot: Apply pagination
      const result = paginate(favoritesWithLinks, page, limit);
      
      res.json(result);
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to retrieve favorites')
      );
    }
  });

  // generated-by-copilot: POST /favorites - Add to favorites with duplicate prevention
  router.post('/', authenticateToken, (req, res) => {
    const { bookId } = req.body;
    
    // generated-by-copilot: Validate required field
    if (!bookId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Book ID is required', ['Book ID is required'])
      );
    }
    
    try {
      // generated-by-copilot: Validate book exists
      const books = readJSON(booksFile);
      const book = books.find(b => String(b.id) === String(bookId));
      
      if (!book) {
        return res.status(404).json(
          createErrorResponse('BOOK_NOT_FOUND', 'Book not found')
        );
      }
      
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === req.user.username);
      
      if (!user) {
        return res.status(404).json(
          createErrorResponse('USER_NOT_FOUND', 'User not found')
        );
      }
      
      // generated-by-copilot: Initialize favorites array if it doesn't exist
      if (!user.favorites) {
        user.favorites = [];
      }
      
      // generated-by-copilot: Convert bookId to string for consistent comparison
      const bookIdStr = String(bookId);
      
      // generated-by-copilot: Check for duplicate and return 409 Conflict
      if (user.favorites.indexOf(bookIdStr) !== -1) {
        return res.status(409).json(
          createErrorResponse('ALREADY_FAVORITED', 'Book is already in favorites')
        );
      }
      
      user.favorites.push(bookIdStr);
      writeJSON(usersFile, users);
      
      res.status(201).json(createSuccessResponse('Book added to favorites'));
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to add book to favorites')
      );
    }
  });

  // generated-by-copilot: DELETE /favorites - Clear all favorites for the authenticated user
  router.delete('/', authenticateToken, (req, res) => {
    try {
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === req.user.username);

      if (!user) {
        return res.status(404).json(
          createErrorResponse('USER_NOT_FOUND', 'User not found')
        );
      }

      user.favorites = [];
      writeJSON(usersFile, users);

      res.status(204).send();
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to clear favorites')
      );
    }
  });

  // generated-by-copilot: DELETE /favorites/:bookId - Remove from favorites
  router.delete('/:bookId', authenticateToken, (req, res) => {
    const { bookId } = req.params;
    
    try {
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === req.user.username);
      
      if (!user) {
        return res.status(404).json(
          createErrorResponse('USER_NOT_FOUND', 'User not found')
        );
      }
      
      if (!user.favorites) {
        user.favorites = [];
      }
      
      const bookIdStr = String(bookId);
      const favoriteIndex = user.favorites.indexOf(bookIdStr);
      
      if (favoriteIndex === -1) {
        return res.status(404).json(
          createErrorResponse('FAVORITE_NOT_FOUND', 'Book not found in favorites')
        );
      }
      
      user.favorites.splice(favoriteIndex, 1);
      writeJSON(usersFile, users);
      
      // generated-by-copilot: Return 204 No Content for successful deletion
      res.status(204).send();
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to remove book from favorites')
      );
    }
  });

  return router;
}

module.exports = createFavoritesRouter;
