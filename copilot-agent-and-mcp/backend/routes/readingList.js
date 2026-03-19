const express = require('express');
const { 
  createErrorResponse, 
  createSuccessResponse, 
  paginate, 
  validatePaginationParams 
} = require('../utils/apiUtils');

function createReadingListRouter({ usersFile, booksFile, readJSON, writeJSON, authenticateToken }) {
  const router = express.Router();

  // generated-by-copilot: GET /reading-lists - Paginated and filtered user's reading list
  router.get('/', authenticateToken, (req, res) => {
    try {
      const { page, limit } = validatePaginationParams(req.query.page, req.query.limit);
      const { status } = req.query;
      
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === req.user.username);
      
      if (!user) {
        return res.status(404).json(
          createErrorResponse('USER_NOT_FOUND', 'User not found')
        );
      }

      const books = readJSON(booksFile);
      let readingListWithBooks = Object.entries(user.readingList || {}).map(([bookId, readingData]) => {
        const book = books.find(b => String(b.id) === String(bookId));
        if (!book) return null; // Skip if book no longer exists
        return {
          ...book,
          readingStatus: readingData.status,
          dateAdded: readingData.dateAdded,
          dateFinished: readingData.dateFinished || null,
          _links: {
            self: { href: `/api/v1/books/${book.id}` },
            update: { href: `/api/v1/reading-lists/${book.id}` },
            remove: { href: `/api/v1/reading-lists/${book.id}` }
          }
        };
      }).filter(Boolean); // Remove null entries

      // generated-by-copilot: Apply status filter if provided
      if (status) {
        const validStatuses = ['want-to-read', 'currently-reading', 'finished'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json(
            createErrorResponse('INVALID_STATUS', 'Invalid status filter', [
              'Status must be: want-to-read, currently-reading, or finished'
            ])
          );
        }
        readingListWithBooks = readingListWithBooks.filter(item => item.readingStatus === status);
      }

      // generated-by-copilot: Apply pagination
      const result = paginate(readingListWithBooks, page, limit);
      
      res.json(result);
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to retrieve reading list')
      );
    }
  });

  // generated-by-copilot: POST /reading-lists - Add book to reading list with comprehensive validation
  router.post('/', authenticateToken, (req, res) => {
    const { bookId, status } = req.body;
    
    // generated-by-copilot: Validate required fields
    if (!bookId || !status) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Book ID and status are required', [
          !bookId ? 'Book ID is required' : '',
          !status ? 'Status is required' : ''
        ].filter(Boolean))
      );
    }

    // generated-by-copilot: Validate status values
    const validStatuses = ['want-to-read', 'currently-reading', 'finished'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(
        createErrorResponse('INVALID_STATUS', 'Invalid status', [
          'Status must be: want-to-read, currently-reading, or finished'
        ])
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

      // generated-by-copilot: Initialize readingList if it doesn't exist
      if (!user.readingList) {
        user.readingList = {};
      }

      // generated-by-copilot: Check if book is already in reading list
      if (user.readingList[bookId]) {
        return res.status(409).json(
          createErrorResponse('ALREADY_IN_LIST', 'Book is already in reading list')
        );
      }

      // generated-by-copilot: Add book to reading list
      const readingData = {
        status,
        dateAdded: new Date().toISOString()
      };

      // generated-by-copilot: Set dateFinished if status is 'finished'
      if (status === 'finished') {
        readingData.dateFinished = new Date().toISOString();
      }

      user.readingList[bookId] = readingData;
      writeJSON(usersFile, users);

      const responseBook = {
        ...book,
        readingStatus: status,
        dateAdded: readingData.dateAdded,
        dateFinished: readingData.dateFinished || null
      };

      res.status(201).json({ 
        message: 'Book added to reading list', 
        book: responseBook 
      });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to add book to reading list')
      );
    }
  });

  // generated-by-copilot: PUT /reading-lists/:bookId - Full replacement of reading status
  router.put('/:bookId', authenticateToken, (req, res) => {
    const { bookId } = req.params;
    const { status } = req.body;

    // generated-by-copilot: Validate status
    const validStatuses = ['want-to-read', 'currently-reading', 'finished'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json(
        createErrorResponse('INVALID_STATUS', 'Invalid status', [
          'Status must be: want-to-read, currently-reading, or finished'
        ])
      );
    }

    try {
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === req.user.username);
      
      if (!user) {
        return res.status(404).json(
          createErrorResponse('USER_NOT_FOUND', 'User not found')
        );
      }

      // generated-by-copilot: Check if book is in reading list
      if (!user.readingList || !user.readingList[bookId]) {
        return res.status(404).json(
          createErrorResponse('BOOK_NOT_IN_LIST', 'Book not found in reading list')
        );
      }

      // generated-by-copilot: Update status and handle dateFinished
      const previousStatus = user.readingList[bookId].status;
      user.readingList[bookId].status = status;

      // generated-by-copilot: Set dateFinished when moving to 'finished' status
      if (status === 'finished' && previousStatus !== 'finished') {
        user.readingList[bookId].dateFinished = new Date().toISOString();
      } else if (status !== 'finished') {
        // generated-by-copilot: Remove dateFinished if moving away from 'finished' status
        delete user.readingList[bookId].dateFinished;
      }

      writeJSON(usersFile, users);
      
      res.json(createSuccessResponse('Reading status updated'));
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to update reading status')
      );
    }
  });

  // generated-by-copilot: PATCH /reading-lists/:bookId - Partial update of reading status
  router.patch('/:bookId', authenticateToken, (req, res) => {
    const { bookId } = req.params;
    const { status } = req.body;

    // generated-by-copilot: Validate status if provided
    if (status) {
      const validStatuses = ['want-to-read', 'currently-reading', 'finished'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json(
          createErrorResponse('INVALID_STATUS', 'Invalid status', [
            'Status must be: want-to-read, currently-reading, or finished'
          ])
        );
      }
    }

    try {
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === req.user.username);
      
      if (!user) {
        return res.status(404).json(
          createErrorResponse('USER_NOT_FOUND', 'User not found')
        );
      }

      // generated-by-copilot: Check if book is in reading list
      if (!user.readingList || !user.readingList[bookId]) {
        return res.status(404).json(
          createErrorResponse('BOOK_NOT_IN_LIST', 'Book not found in reading list')
        );
      }

      // generated-by-copilot: Update only provided fields (currently just status)
      if (status) {
        const previousStatus = user.readingList[bookId].status;
        user.readingList[bookId].status = status;

        // generated-by-copilot: Handle dateFinished logic
        if (status === 'finished' && previousStatus !== 'finished') {
          user.readingList[bookId].dateFinished = new Date().toISOString();
        } else if (status !== 'finished') {
          delete user.readingList[bookId].dateFinished;
        }
      }

      writeJSON(usersFile, users);
      
      res.json(createSuccessResponse('Reading status updated'));
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to update reading status')
      );
    }
  });

  // generated-by-copilot: DELETE /reading-lists/:bookId - Remove book from reading list with 204 response
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

      // generated-by-copilot: Check if book is in reading list
      if (!user.readingList || !user.readingList[bookId]) {
        return res.status(404).json(
          createErrorResponse('BOOK_NOT_IN_LIST', 'Book not found in reading list')
        );
      }

      // generated-by-copilot: Remove book from reading list
      delete user.readingList[bookId];
      writeJSON(usersFile, users);

      // generated-by-copilot: Return 204 No Content for successful deletion
      res.status(204).send();
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to remove book from reading list')
      );
    }
  });

  return router;
}

module.exports = createReadingListRouter;