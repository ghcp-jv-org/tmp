---
name: generating-test-fixtures
description: >
  Generates Jest backend test fixtures and Cypress E2E test scaffolds for the
  Book Favorites app. Produces ready-to-run test files with realistic assertions
  derived from seeded data. Use when: test fixtures, test scaffolding, generate
  tests, backend tests, E2E tests, supertest, cypress, fixture generation,
  scaffold tests. Works with the seeding-test-data skill and follows
  testing.instructions.md conventions.
argument-hint: 'Describe what to test (e.g., "books API CRUD endpoints" or "login flow E2E")'
user-invocable: true
---

# Generating Test Fixtures

## Quick Start

```bash
node .github/skills/generating-test-fixtures/scripts/generate-fixtures.js --type backend --resource books
```

## Workflow

Copy this checklist and track progress:

```
Test Fixture Progress:
- [ ] Step 1: Identify endpoints or flows to test
- [ ] Step 2: Choose fixture type (backend Jest or frontend Cypress)
- [ ] Step 3: Generate fixtures using templates
- [ ] Step 4: Run tests to verify
- [ ] Step 5: Review coverage
```

**Step 1: Identify endpoints or flows to test**

List the API endpoints (e.g., `GET /api/v1/books`, `POST /api/v1/favorites`) or UI flows (e.g., login, add to favorites) that need test coverage.

**Step 2: Choose fixture type**

| Type | Tool | Output location |
| --- | --- | --- |
| Backend Jest | supertest | `backend/tests/{resource}.test.js` |
| Frontend Cypress E2E | Cypress | `frontend/cypress/e2e/{resource}.cy.js` |

**Step 3: Generate fixtures using templates**

Use the automated script:

```bash
# generated-by-copilot: Backend fixture for a resource
node .github/skills/generating-test-fixtures/scripts/generate-fixtures.js --type backend --resource books

# generated-by-copilot: E2E fixture for a resource
node .github/skills/generating-test-fixtures/scripts/generate-fixtures.js --type e2e --resource favorites
```

Or copy templates manually from [templates.md](./templates.md) and adapt them.

**Step 4: Run tests to verify**

```bash
# generated-by-copilot: Run backend tests
npm run test:backend

# generated-by-copilot: Run E2E tests
npm run build:frontend && npm run test:frontend
```

If tests fail, check assertion values against the current seeded data and adjust.

**Step 5: Review coverage**

Verify that both success and error cases are covered for every endpoint or flow. Each `describe` block should have `it` blocks for success, 400 (missing fields), 401 (no token), and 404 (not found) where applicable.

## Project Conventions

### Backend Jest Tests

- Location: `backend/tests/` with `.test.js` extension
- HTTP testing: supertest
- Run command: `npm run test:backend`
- Structure: one `describe` block per route, one `it` block per scenario
- Always test both success and error cases (400, 401, 404)
- Start test descriptions with "should"
- Start all comments with `generated-by-copilot: `

### Frontend Cypress E2E Tests

- Location: `frontend/cypress/e2e/` with `.cy.js` extension
- Run command: `npm run build:frontend && npm run test:frontend`
- Element selection: `cy.get('[data-testid="..."]')` for element targeting
- Start test descriptions with "should"
- Start all comments with `generated-by-copilot: `

## References

- **Test templates**: See [templates.md](./templates.md) for detailed Jest and Cypress test templates
- **Fixture generator**: Run [scripts/generate-fixtures.js](./scripts/generate-fixtures.js) for automated fixture generation
