// generated-by-copilot: Updated to use reading-lists (plural) for REST consistency
const createAuthRouter = require('./auth');
const createBooksRouter = require('./books');
const createFavoritesRouter = require('./favorites');
const createReadingListRouter = require('./readingList');
const createStaffPicksRouter = require('./staffPicks');

function createApiRouter(deps) {
  const express = require('express');
  const router = express.Router();

  router.use('/', createAuthRouter(deps));
  router.use('/books', createBooksRouter(deps));
  router.use('/favorites', createFavoritesRouter(deps));
  router.use('/reading-lists', createReadingListRouter(deps));
  // generated-by-copilot: Staff picks endpoint (no auth required)
  router.use('/staff-picks', createStaffPicksRouter());

  return router;
}

module.exports = createApiRouter;
