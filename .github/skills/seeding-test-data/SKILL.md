---
name: seeding-test-data
description: >
  Generates realistic seed data for the Book Favorites app JSON data files
  in backend/data/ (books.json, users.json). Supports configurable volume
  (small, medium, large) and scenarios (empty, typical, edge-cases, stress-test).
  Use when setting up test data, resetting the database, preparing demo
  environments, or when the user mentions seeding, test data, or sample data.
argument-hint: Specify volume and scenario (e.g., "medium typical" or "small edge-cases")
user-invocable: true
---

# Seeding Test Data

## Quick start

Run the utility script to generate seed data:

```bash
node .github/skills/seeding-test-data/scripts/seed-data.js --volume medium --scenario typical
```

This creates `backend/data/books.json` and `backend/data/users.json` with realistic sample records.

## Workflow

Copy this checklist and track progress:

```
Seed Data Progress:
- [ ] Step 1: Back up existing data files
- [ ] Step 2: Choose volume and scenario
- [ ] Step 3: Run seed script
- [ ] Step 4: Validate output
- [ ] Step 5: Verify app loads correctly
```

**Step 1: Back up existing data files**

Create backups before overwriting:

```bash
cp backend/data/books.json backend/data/books.backup.json
cp backend/data/users.json backend/data/users.backup.json
```

**Step 2: Choose volume and scenario**

| Volume | Books | Users | Use case |
| --- | --- | --- | --- |
| `small` | 5 | 3 | Unit tests, quick debugging |
| `medium` | 25 | 10 | Feature development, demos |
| `large` | 100 | 50 | Performance testing, pagination |

For scenario definitions (empty, typical, edge-cases, stress-test), see [scenarios.md](scenarios.md).

**Step 3: Run seed script**

```bash
node .github/skills/seeding-test-data/scripts/seed-data.js --volume <size> --scenario <name>
```

The script writes directly to `backend/data/books.json` and `backend/data/users.json` using `JSON.stringify(data, null, 2)` formatting.

**Step 4: Validate output**

After seeding, verify the data:

```bash
node -e "const b=require('./backend/data/books.json'); const u=require('./backend/data/users.json'); console.log('Books:', b.length, '| Users:', u.length); console.log('Sample book:', JSON.stringify(b[0], null, 2))"
```

If validation fails, check the error message, adjust the scenario, and re-run Step 3.

**Step 5: Verify app loads correctly**

Restart the backend server and check:

```bash
curl http://localhost:4000/api/books | node -e "process.stdin.on('data',d=>console.log('Response OK:', JSON.parse(d).length, 'books'))"
```

## Data Schemas

### books.json

Each book must include these fields:

```json
{
  "id": "unique-string",
  "title": "string",
  "author": "string",
  "isbn": "string (13 digits)",
  "year": "number (1900-2025)",
  "description": "string (1-2 sentences)"
}
```

### users.json

Each user must include these fields:

```json
{
  "id": "unique-string",
  "username": "string (lowercase, no spaces)",
  "email": "string (valid format)",
  "password": "string (bcrypt hash)",
  "favorites": ["array of book IDs"]
}
```

## Reference Files

- **Scenario definitions**: See [scenarios.md](scenarios.md) for detailed descriptions of each scenario, including edge-case field values and stress-test patterns
- **Utility script**: Run `scripts/seed-data.js` to generate data (do not read the script - execute it)