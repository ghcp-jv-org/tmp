#!/usr/bin/env node

// generated-by-copilot: Test fixture generator for the Book Favorites app.
// Reads seeded data from backend/data/ and outputs ready-to-run test files.

const fs = require('fs');
const path = require('path');

// generated-by-copilot: Parse command-line arguments
const args = process.argv.slice(2);
const typeIndex = args.indexOf('--type');
const resourceIndex = args.indexOf('--resource');

if (typeIndex === -1 || resourceIndex === -1 || !args[typeIndex + 1] || !args[resourceIndex + 1]) {
  console.error('Usage: node generate-fixtures.js --type <backend|e2e> --resource <resource>');
  console.error('  --type      backend or e2e');
  console.error('  --resource  Resource name (e.g., books, favorites, users)');
  process.exit(1);
}

const type = args[typeIndex + 1];
const resource = args[resourceIndex + 1];

if (type !== 'backend' && type !== 'e2e') {
  console.error(`Error: Invalid type "${type}". Must be "backend" or "e2e".`);
  process.exit(1);
}

// generated-by-copilot: Resolve project root (four levels up from this script)
const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
const dataDir = path.join(projectRoot, 'copilot-agent-and-mcp', 'backend', 'data');
const dataFile = path.join(dataDir, `${resource}.json`);

// generated-by-copilot: Read seeded data to generate realistic assertions
let seedData;
try {
  if (!fs.existsSync(dataFile)) {
    console.error(`Error: Data file not found at ${dataFile}`);
    console.error('Make sure you have seeded data first (see the seeding-test-data skill).');
    process.exit(1);
  }
  const raw = fs.readFileSync(dataFile, 'utf-8');
  try {
    seedData = JSON.parse(raw);
  } catch (parseErr) {
    console.error(`Error: Invalid JSON in ${dataFile}: ${parseErr.message}`);
    process.exit(1);
  }
} catch (readErr) {
  console.error(`Error: Could not read ${dataFile}: ${readErr.message}`);
  process.exit(1);
}

if (!Array.isArray(seedData) || seedData.length === 0) {
  console.error(`Error: ${dataFile} is empty or not an array. Seed data first.`);
  process.exit(1);
}

// generated-by-copilot: Extract sample record for realistic assertions
const sample = seedData[0];
const sampleId = sample.id || 'unknown-id';
const sampleTitle = sample.title || sample.username || 'unknown';

if (type === 'backend') {
  generateBackendFixture(resource, seedData, sampleId, sampleTitle);
} else {
  generateE2EFixture(resource, seedData, sampleId, sampleTitle);
}

// generated-by-copilot: Generate a Jest/supertest backend test file
function generateBackendFixture(resource, data, sampleId, sampleTitle) {
  const capitalised = resource.charAt(0).toUpperCase() + resource.slice(1);
  const outputDir = path.join(projectRoot, 'copilot-agent-and-mcp', 'backend', 'tests');
  const outputFile = path.join(outputDir, `${resource}.test.js`);

  if (fs.existsSync(outputFile)) {
    console.error(`Error: Test file already exists at ${outputFile}`);
    console.error('Remove or rename the existing file before generating a new one.');
    process.exit(1);
  }

  const content = `// generated-by-copilot: Jest test fixture for ${capitalised} API (auto-generated)
const request = require('supertest');
const express = require('express');
const createApiRouter = require('../routes');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'test_secret';
const usersFile = path.join(__dirname, '../data/test-users.json');
const booksFile = path.join(__dirname, '../data/test-books.json');

// generated-by-copilot: Helper to generate a valid JWT
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

describe('${capitalised} API', () => {
  // generated-by-copilot: Seeded data contains ${data.length} records
  // generated-by-copilot: Sample ID: ${JSON.stringify(sampleId)}
  // generated-by-copilot: Sample title/name: ${JSON.stringify(sampleTitle)}

  describe('GET /api/${resource}', () => {
    it('should return a list of ${resource}', async () => {
      const token = getToken();
      const res = await request(app)
        .get('/api/${resource}')
        .set('Authorization', \`Bearer \${token}\`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(${data.length});
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/${resource}');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/${resource}/:id', () => {
    it('should return a single ${resource} when found', async () => {
      const token = getToken();
      const res = await request(app)
        .get('/api/${resource}/${sampleId}')
        .set('Authorization', \`Bearer \${token}\`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', ${JSON.stringify(sampleId)});
    });

    it('should return 404 when ${resource} not found', async () => {
      const token = getToken();
      const res = await request(app)
        .get('/api/${resource}/nonexistent-id')
        .set('Authorization', \`Bearer \${token}\`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/${resource}/${sampleId}');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/${resource}', () => {
    it('should create a new ${resource} with valid data', async () => {
      const token = getToken();
      const res = await request(app)
        .post('/api/${resource}')
        .set('Authorization', \`Bearer \${token}\`)
        .send(${JSON.stringify(sample, null, 6).replace(/\n/g, '\n      ')});
      expect([200, 201]).toContain(res.statusCode);
    });

    it('should return 400 when required fields are missing', async () => {
      const token = getToken();
      const res = await request(app)
        .post('/api/${resource}')
        .set('Authorization', \`Bearer \${token}\`)
        .send({});
      expect(res.statusCode).toBe(400);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .post('/api/${resource}')
        .send({});
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/${resource}/:id', () => {
    it('should delete an existing ${resource}', async () => {
      const token = getToken();
      const res = await request(app)
        .delete('/api/${resource}/${sampleId}')
        .set('Authorization', \`Bearer \${token}\`);
      expect([200, 204]).toContain(res.statusCode);
    });

    it('should return 404 when ${resource} not found', async () => {
      const token = getToken();
      const res = await request(app)
        .delete('/api/${resource}/nonexistent-id')
        .set('Authorization', \`Bearer \${token}\`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).delete('/api/${resource}/${sampleId}');
      expect(res.statusCode).toBe(401);
    });
  });
});
`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, content, 'utf-8');
  console.log(`Backend test fixture generated: ${outputFile}`);
  console.log(`Run with: npm run test:backend`);
}

// generated-by-copilot: Generate a Cypress E2E test file
function generateE2EFixture(resource, data, sampleId, sampleTitle) {
  const capitalised = resource.charAt(0).toUpperCase() + resource.slice(1);
  const outputDir = path.join(projectRoot, 'copilot-agent-and-mcp', 'frontend', 'cypress', 'e2e');
  const outputFile = path.join(outputDir, `${resource}.cy.js`);

  if (fs.existsSync(outputFile)) {
    console.error(`Error: Test file already exists at ${outputFile}`);
    console.error('Remove or rename the existing file before generating a new one.');
    process.exit(1);
  }

  const content = `// generated-by-copilot: Cypress E2E test fixture for ${capitalised} (auto-generated)
// generated-by-copilot: Uses seeded data — sample record ID: ${JSON.stringify(sampleId)}, title/name: ${JSON.stringify(sampleTitle)}

describe('${capitalised} E2E', () => {
  // generated-by-copilot: Generate random credentials for test isolation
  const username = \`e2euser\${Math.floor(Math.random() * 10000)}\`;
  const password = \`e2epass\${Math.floor(Math.random() * 10000)}\`;

  // generated-by-copilot: Helper to register and login
  const registerAndLogin = () => {
    cy.visit('http://localhost:5173');
    cy.contains('Create Account').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button#register').click();
    cy.contains('Registration successful').should('exist');
    cy.wait(2000);
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button#login').click();
    cy.contains(\`Hi, \${username}\`).should('exist');
  };

  // generated-by-copilot: Helper to login an existing user
  const login = () => {
    cy.visit('http://localhost:5173');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button#login').click();
    cy.contains(\`Hi, \${username}\`).should('exist');
  };

  it('should register and login successfully', () => {
    registerAndLogin();
  });

  it('should display ${resource} page after login', () => {
    registerAndLogin();
    cy.get('[data-testid="${resource}-link"]').click();
    cy.get('[data-testid="${resource}-heading"]').should('exist');
  });

  it('should show ${resource} items from seeded data', () => {
    registerAndLogin();
    cy.get('[data-testid="${resource}-link"]').click();
    cy.get('[data-testid="${resource}-card"]').should('have.length.greaterThan', 0);
  });

  it('should handle empty state gracefully', () => {
    registerAndLogin();
    cy.get('[data-testid="${resource}-link"]').click();
    // generated-by-copilot: Verify page loads without errors
    cy.get('[data-testid="${resource}-heading"]').should('be.visible');
  });
});
`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, content, 'utf-8');
  console.log(`E2E test fixture generated: ${outputFile}`);
  console.log(`Run with: npm run build:frontend && npm run test:frontend`);
}
