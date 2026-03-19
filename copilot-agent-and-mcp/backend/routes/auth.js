const express = require('express');
const jwt = require('jsonwebtoken');
const { createErrorResponse, createSuccessResponse } = require('../utils/apiUtils');

function createAuthRouter({ usersFile, readJSON, writeJSON, SECRET_KEY }) {
  const router = express.Router();

  // generated-by-copilot: POST /users - REST compliant user registration endpoint
  router.post('/users', (req, res) => {
    const { username, password } = req.body;
    
    // generated-by-copilot: Validate required fields
    if (!username || !password) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Username and password are required', [
          !username ? 'Username is required' : '',
          !password ? 'Password is required' : ''
        ].filter(Boolean))
      );
    }
    
    // generated-by-copilot: Validate password length
    if (password.length < 6) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Password must be at least 6 characters', [
          'Password must be at least 6 characters'
        ])
      );
    }
    
    try {
      const users = readJSON(usersFile);
      if (users.find(u => u.username === username)) {
        return res.status(409).json(
          createErrorResponse('USER_EXISTS', 'User already exists')
        );
      }
      
      // generated-by-copilot: Initialize user with favorites and readingList
      users.push({ username, password, favorites: [], readingList: {} });
      writeJSON(usersFile, users);
      res.status(201).json(createSuccessResponse('User registered'));
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to create user')
      );
    }
  });

  // generated-by-copilot: POST /auth/tokens - REST compliant authentication endpoint
  router.post('/auth/tokens', (req, res) => {
    const { username, password } = req.body;
    
    // generated-by-copilot: Validate required fields
    if (!username || !password) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Username and password are required')
      );
    }
    
    try {
      const users = readJSON(usersFile);
      const user = users.find(u => u.username === username && u.password === password);
      
      if (!user) {
        return res.status(401).json(
          createErrorResponse('INVALID_CREDENTIALS', 'Invalid username or password')
        );
      }
      
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      
      // generated-by-copilot: Add rate limit headers (placeholder values)
      res.set({
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '99'
      });
      
      res.json({ token });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Authentication failed')
      );
    }
  });

  return router;
}

module.exports = createAuthRouter;
