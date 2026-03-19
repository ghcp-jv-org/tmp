---
name: 'Testing Standards'
description: 'Testing conventions for Jest backend tests and Cypress E2E tests'
applyTo: '**/*.{test,spec,cy}.{js,jsx}'
---

# Testing Standards

## Backend Jest Tests
- **Location:** `backend/tests/` directory
- **Extension:** `.test.js` files
- **HTTP Testing:** Use supertest for HTTP assertions
- **Run Command:** `npm run test:backend`
- **Structure:** One `describe` block per route, one `it` block per scenario
- **Assertions:** Always test both success and error cases (400, 401, 404 status codes)
- **Naming:** Start all test descriptions with "should"

**Example:**
```javascript
const request = require('supertest');
const app = require('../app');

describe('GET /api/users/:id', () => {
  it('should return user when found', () => {
    return request(app)
      .get('/api/users/1')
      .expect(200);
  });

  it('should return 404 when user not found', () => {
    return request(app)
      .get('/api/users/999')
      .expect(404);
  });

  it('should return 401 when unauthorized', () => {
    return request(app)
      .get('/api/users/1')
      .expect(401);
  });
});
```

## Frontend Cypress E2E Tests
- **Location:** `frontend/cypress/e2e/` directory
- **Extension:** `.cy.js` files
- **Element Selection:** Use `cy.get('[data-testid="..."]')` for element targeting
- **Run Command:** `npm run build:frontend && npm run test:frontend`
- **Naming:** Start all test descriptions with "should"
- **Best Practice:** Test specs in isolation; use data attributes for resilient selectors

**Example:**
```javascript
describe('Login Page', () => {
  it('should display login form', () => {
    cy.visit('/login');
    cy.get('[data-testid="login-form"]').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('wrong-pwd');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
  });
});
```
