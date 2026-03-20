const express = require('express');
const { createErrorResponse, createSuccessResponse } = require('../utils/apiUtils');

function createReviewsRouter({ reviewsFile, booksFile, readJSON, writeJSON, authenticateToken }) {
  const router = express.Router();

  // generated-by-copilot: POST /reviews - Submit a review for a book (auth required)
  router.post('/', authenticateToken, (req, res) => {
    const { bookId, rating, reviewText } = req.body;

    // generated-by-copilot: Validate required fields
    if (!bookId || rating === undefined || rating === null || !reviewText) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'bookId, rating, and reviewText are required', [
          !bookId ? 'bookId is required' : '',
          (rating === undefined || rating === null) ? 'rating is required' : '',
          !reviewText ? 'reviewText is required' : ''
        ].filter(Boolean))
      );
    }

    // generated-by-copilot: Validate rating is 1-5
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Rating must be an integer between 1 and 5')
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

      const reviews = readJSON(reviewsFile);

      // generated-by-copilot: Check if user already reviewed this book
      const existing = reviews.find(
        r => String(r.bookId) === String(bookId) && r.username === req.user.username
      );
      if (existing) {
        return res.status(409).json(
          createErrorResponse('ALREADY_REVIEWED', 'You have already reviewed this book')
        );
      }

      // generated-by-copilot: Generate a unique ID using timestamp and random hex to avoid collisions
      const id = `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
      const newReview = {
        id,
        bookId: String(bookId),
        username: req.user.username,
        rating: ratingNum,
        reviewText: String(reviewText).trim(),
        createdAt: new Date().toISOString()
      };

      reviews.push(newReview);
      writeJSON(reviewsFile, reviews);

      res.status(201).json({ message: 'Review submitted', review: newReview });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to submit review')
      );
    }
  });

  // generated-by-copilot: GET /reviews/:bookId - Get all reviews for a specific book
  router.get('/:bookId', (req, res) => {
    const { bookId } = req.params;

    try {
      // generated-by-copilot: Validate book exists
      const books = readJSON(booksFile);
      const book = books.find(b => String(b.id) === String(bookId));
      if (!book) {
        return res.status(404).json(
          createErrorResponse('BOOK_NOT_FOUND', 'Book not found')
        );
      }

      const reviews = readJSON(reviewsFile);
      const bookReviews = reviews.filter(r => String(r.bookId) === String(bookId));

      res.json({ data: bookReviews });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to retrieve reviews')
      );
    }
  });

  // generated-by-copilot: GET /reviews/:bookId/average - Get average rating for a book
  router.get('/:bookId/average', (req, res) => {
    const { bookId } = req.params;

    try {
      // generated-by-copilot: Validate book exists
      const books = readJSON(booksFile);
      const book = books.find(b => String(b.id) === String(bookId));
      if (!book) {
        return res.status(404).json(
          createErrorResponse('BOOK_NOT_FOUND', 'Book not found')
        );
      }

      const reviews = readJSON(reviewsFile);
      const bookReviews = reviews.filter(r => String(r.bookId) === String(bookId));

      const averageRating = bookReviews.length > 0
        ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length
        : null;

      res.json({
        bookId: String(bookId),
        averageRating,
        reviewCount: bookReviews.length
      });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to retrieve average rating')
      );
    }
  });

  return router;
}

module.exports = createReviewsRouter;
