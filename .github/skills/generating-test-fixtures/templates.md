# Test Templates

## Jest / Supertest Backend Template

Use this template for API endpoint tests. Replace `{resource}` with the resource name and adjust routes, fields, and assertions to match.

```javascript
// generated-by-copilot: Jest test fixture for {resource} API endpoints
const request = require('supertest');
const express = require('express');
const createApiRouter = require('../routes');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'test_secret';
const usersFile = path.join(__dirname, '../data/test-users.json');
const booksFile = path.join(__dirname, '../data/test-books.json');

// generated-by-copilot: Helper to generate a valid JWT for authenticated requests
function getToken(username = 'user1') {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
}

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

describe('{Resource} API', () => {

  // --- GET /{resource} ---

  describe('GET /api/{resource}', () => {
    it('should return a list of {resource}', async () => {
      const token = getToken();
      const res = await request(app)
        .get('/api/{resource}')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/{resource}');
      expect(res.statusCode).toBe(401);
    });
  });

  // --- GET /{resource}/:id ---

  describe('GET /api/{resource}/:id', () => {
    it('should return a single {resource} when found', async () => {
      const token = getToken();
      const res = await request(app)
        .get('/api/{resource}/VALID_ID')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
    });

    it('should return 404 when {resource} not found', async () => {
      const token = getToken();
      const res = await request(app)
        .get('/api/{resource}/nonexistent-id')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/{resource}/VALID_ID');
      expect(res.statusCode).toBe(401);
    });
  });

  // --- POST /{resource} ---

  describe('POST /api/{resource}', () => {
    it('should create a new {resource} with valid data', async () => {
      const token = getToken();
      const res = await request(app)
        .post('/api/{resource}')
        .set('Authorization', `Bearer ${token}`)
        .send({ /* valid fields */ });
      expect(res.statusCode).toBe(201);
    });

    it('should return 400 when required fields are missing', async () => {
      const token = getToken();
      const res = await request(app)
        .post('/api/{resource}')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .post('/api/{resource}')
        .send({ /* valid fields */ });
      expect(res.statusCode).toBe(401);
    });
  });

  // --- PUT /{resource}/:id ---

  describe('PUT /api/{resource}/:id', () => {
    it('should update an existing {resource}', async () => {
      const token = getToken();
      const res = await request(app)
        .put('/api/{resource}/VALID_ID')
        .set('Authorization', `Bearer ${token}`)
        .send({ /* updated fields */ });
      expect(res.statusCode).toBe(200);
    });

    it('should return 404 when {resource} not found', async () => {
      const token = getToken();
      const res = await request(app)
        .put('/api/{resource}/nonexistent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({ /* updated fields */ });
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 when required fields are missing', async () => {
      const token = getToken();
      const res = await request(app)
        .put('/api/{resource}/VALID_ID')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .put('/api/{resource}/VALID_ID')
        .send({ /* updated fields */ });
      expect(res.statusCode).toBe(401);
    });
  });

  // --- DELETE /{resource}/:id ---

  describe('DELETE /api/{resource}/:id', () => {
    it('should delete an existing {resource}', async () => {
      const token = getToken();
      const res = await request(app)
        .delete('/api/{resource}/VALID_ID')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });

    it('should return 404 when {resource} not found', async () => {
      const token = getToken();
      const res = await request(app)
        .delete('/api/{resource}/nonexistent-id')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).delete('/api/{resource}/VALID_ID');
      expect(res.statusCode).toBe(401);
    });
  });
});
```

## Cypress E2E Template

Use this template for frontend flow tests. Replace placeholders with actual data-testid values and flow-specific steps.

### Login Flow

```javascript
// generated-by-copilot: Cypress E2E test for login flow
describe('Login Flow', () => {
  // generated-by-copilot: Generate random credentials for test isolation
  const username = `e2euser${Math.floor(Math.random() * 10000)}`;
  const password = `e2epass${Math.floor(Math.random() * 10000)}`;

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.get('[data-testid="username-input"]').type('baduser');
    cy.get('[data-testid="password-input"]').type('badpass');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should register a new user successfully', () => {
    cy.get('[data-testid="register-link"]').click();
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="user-greeting"]').should('contain', username);
  });

  it('should logout successfully', () => {
    // generated-by-copilot: Login first
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="logout-button"]').click();
    cy.get('[data-testid="login-form"]').should('be.visible');
  });
});
```

### Viewing Books List

```javascript
// generated-by-copilot: Cypress E2E test for viewing books list
describe('Books List', () => {
  const username = `e2euser${Math.floor(Math.random() * 10000)}`;
  const password = `e2epass${Math.floor(Math.random() * 10000)}`;

  before(() => {
    // generated-by-copilot: Register and login before all tests
    cy.visit('http://localhost:5173');
    cy.get('[data-testid="register-link"]').click();
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="register-button"]').click();
  });

  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
  });

  it('should display the books page', () => {
    cy.get('[data-testid="books-link"]').click();
    cy.get('[data-testid="books-heading"]').should('contain', 'Books');
  });

  it('should show a list of books', () => {
    cy.get('[data-testid="books-link"]').click();
    cy.get('[data-testid="book-card"]').should('have.length.greaterThan', 0);
  });

  it('should display book title and author', () => {
    cy.get('[data-testid="books-link"]').click();
    cy.get('[data-testid="book-card"]').first().within(() => {
      cy.get('[data-testid="book-title"]').should('not.be.empty');
      cy.get('[data-testid="book-author"]').should('not.be.empty');
    });
  });
});
```

### Adding to Favorites

```javascript
// generated-by-copilot: Cypress E2E test for adding books to favorites
describe('Add to Favorites', () => {
  const username = `e2euser${Math.floor(Math.random() * 10000)}`;
  const password = `e2epass${Math.floor(Math.random() * 10000)}`;

  before(() => {
    // generated-by-copilot: Register user for favorites tests
    cy.visit('http://localhost:5173');
    cy.get('[data-testid="register-link"]').click();
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="register-button"]').click();
  });

  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
  });

  it('should add a book to favorites', () => {
    cy.get('[data-testid="books-link"]').click();
    cy.get('[data-testid="add-favorite-button"]').first().click();
    cy.get('[data-testid="favorites-link"]').click();
    cy.get('[data-testid="favorite-book-card"]').should('have.length.greaterThan', 0);
  });

  it('should show the favorited book in favorites list', () => {
    cy.get('[data-testid="favorites-link"]').click();
    cy.get('[data-testid="favorite-book-card"]').should('exist');
    cy.get('[data-testid="book-title"]').should('not.be.empty');
  });

  it('should not duplicate a book already in favorites', () => {
    cy.get('[data-testid="books-link"]').click();
    // generated-by-copilot: The button should indicate the book is already favorited
    cy.get('[data-testid="add-favorite-button"]').first().should('be.disabled');
  });
});
```
