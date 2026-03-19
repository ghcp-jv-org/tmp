---
name: 'Express API Standards'
description: 'Standardized routing patterns, dependency injection, and API conventions for Express.js backend'
applyTo: '**/*.js'
---

# Express API Standards

Each resource gets its own route file in `backend/routes/` (e.g., `books.js`, `favorites.js`) and exports a factory function that receives `deps` for dependency injection.

## Route File Structure

```javascript
module.exports = (deps) => {
  const router = require('express').Router();

  router.get('/', (req, res) => {
    // Handler with access to deps: deps.db, deps.logger, etc.
  });

  return router;
};
```

## Route Registration

All routers must be registered in `backend/routes/index.js` via `router.use()`:

```javascript
router.use('/books', require('./books')(deps));
router.use('/favorites', require('./favorites')(deps));
```

## API Conventions

- **Resource paths**: Use plural nouns (`/books`, `/reading-lists`)
- **Protected endpoints**: Apply `authenticateToken` middleware
- **HTTP Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- **Error format**: Always return `{ error: 'message' }`; never expose stack traces
- **Data files**: Store JSON data in `backend/data/`; write with `JSON.stringify(data, null, 2)`
