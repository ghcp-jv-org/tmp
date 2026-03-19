# Lab 06 - Automated Test Generation & Code Quality

> **Mode:** VS Code + GitHub.com  
> **Duration:** 45 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md)

---

## Objective

Use Copilot to generate unit tests, increase test coverage, and improve code quality. Demonstrate both interactive (Agent Mode) and autonomous (Coding Agent) test generation.

| Exercise | Skill | What You Learn |
| --- | --- | --- |
| 1 | **Targeted test generation** | Point Agent Mode at a specific route and generate tests interactively - review quality, fix failures in real time |
| 2 | **Autonomous coverage increase** | Assign a coverage goal to the Coding Agent via an issue - it decides what to test and submits a PR |
| 3 | **AI-assisted code review** | Use Agent Mode as a code quality reviewer - it finds issues no test would catch (inconsistency, missing validation) |
| 4 | **Testing untested code** | Generate tests for the MCP server (which has zero tests) - learn to test code you didn’t write |

---

## Exercise 1: Targeted Test Generation - Favorites Route

> **Purpose:** Point Agent Mode at one specific file (`routes/favorites.js`) and generate focused tests. You’ll review the generated tests for quality, fix any failures interactively, and learn what “good enough” AI-generated tests look like vs. what needs human judgment.

### Step 1: Check Current Coverage

```
npm run test:backend
```

Note the current test count and any uncovered routes.

### Step 2: Generate Tests for a Specific Route

Open Agent Mode in VS Code and submit:

```
#codebase

Generate comprehensive unit tests for the favorites route (routes/favorites.js). Include:
- Happy path: add a favorite, get favorites, remove a favorite
- Edge cases: duplicate favorite, non-existent book, non-existent user
- Error scenarios: missing required fields, invalid book ID
- Follow the existing test patterns in the tests/ folder
```

### Step 3: Review Generated Tests

1.  Review the test file Copilot creates/modifies
2.  Check:
    *   Test descriptions are clear
    *   Assertions are meaningful (not just `expect(true)`)
    *   Edge cases are actually tested
    *   Mocking is appropriate

### Step 4: Run the Tests

```
npm run test:backend
```

**Expected:** All new tests pass. If any fail, ask Copilot:

```
The test "should handle duplicate favorite" is failing with error: <paste error>. Fix it.
```

### Validation

*   Tests generated for favorites route
*   Happy path, edge cases, and error scenarios covered
*   All tests pass
*   Test patterns match existing style

---

## Exercise 2: Autonomous Coverage Increase - Coding Agent

> **Purpose:** Instead of writing tests yourself, assign a coverage goal to the Coding Agent via a GitHub issue. The agent decides which routes need tests, generates them, and opens a PR. This teaches delegating quality work to agents - you set the goal, the agent executes.

### Step 1: Create the Issue

On GitHub.com, open **Copilot Chat** and submit:

```
Create an issue with:
- Title: Increase backend test coverage to 80%
- Body: Add unit tests for all backend routes (auth, books, comments, favorites). Cover happy paths, error cases, and edge cases. Follow existing test patterns in tests/. Run tests with `npm run test:backend` to verify.
```

### Step 2: Assign to Copilot

1.  Assign the issue to **Copilot**
2.  Wait for 👀 reaction
3.  Monitor in **Actions** tab

**Expected wait:** ~7-10 minutes.

### Step 3: Review the PR

1.  Open the generated PR
2.  Check:
    *   Tests added for each route
    *   No duplicate tests
    *   Tests actually run and pass (check Actions logs)
    *   Edge cases covered

### Step 4: Verify Locally

```
git fetch origin
git checkout <branch-from-PR>
npm run test:backend
```

### Validation

*   Issue created for coverage increase
*   Agent generated tests across multiple routes
*   All tests pass
*   Coverage meaningfully increased

---

## Exercise 3: AI-Assisted Code Review - Quality Issues

> **Purpose:** Use Agent Mode not to write code, but to review it. Ask for a quality audit - the agent finds inconsistencies, missing validation, and structural issues that no test would catch. This teaches using AI as a code review partner, not just a code generator.

### Step 1: Request a Quality Review

In Agent Mode:

```
#codebase

Review the backend codebase for code quality issues:
- Inconsistent error handling patterns
- Missing input validation on route parameters
- Unused variables or imports
- Functions that are too long or complex

For each issue, provide a specific fix.
```

### Step 2: Apply Improvements

1.  Review each suggestion
2.  Accept fixes that improve consistency
3.  Skip changes that are purely stylistic if you disagree

### Step 3: Run Tests After Changes

```
npm run test:backend
```

Verify nothing broke.

### Validation

*   Quality issues identified
*   At least 2-3 improvements applied
*   All tests still pass after changes

---

## Exercise 4: Testing Untested Code - MCP Server

> **Purpose:** The `book-database-mcp-server` has zero tests. Generate tests for code you didn’t write - learn how Agent Mode reads unfamiliar source, infers behavior from types and data, and produces tests that exercise both happy paths and edge cases.

The `book-database-mcp-server` in your workspace has **zero tests**. Use Agent Mode to generate them.

### Step 1: Open the MCP Server Context

In Agent Mode:

```
#file:book-database-mcp-server/src/services/book.service.ts
#file:book-database-mcp-server/src/schemas/book.schemas.ts
#file:book-database-mcp-server/src/types.ts

Generate comprehensive unit tests for the book service (book.service.ts). Create a test file at book-database-mcp-server/src/services/book.service.test.ts.

Test these functions:
- getBookByIsbn: valid ISBN, non-existent ISBN, empty string
- getBookByTitle: exact match, non-existent title, empty string
- getBooksByIsbnList: valid list, empty list, mix of valid/invalid ISBNs
- getBooksByTitles: valid list, empty list, non-existent titles

Use the actual data from books.json and books-details.json for test assertions.
Include ISBN "0446310789" (To Kill a Mockingbird) as a known-good test value.
```

### Step 2: Review Generated Tests

Check that tests:

*   Import functions from the correct relative paths
*   Use real ISBNs from the data files (e.g., `0446310789`, `0451524935`)
*   Cover both found and not-found scenarios
*   Assert on correct return types (`Book`, `BookDetails`, `undefined`)

### Step 3: Run the Tests

```
cd book-database-mcp-server
npx tsx -test src/services/book.service.test.ts
```

If jest/vitest is preferred, ask Copilot:

```
Can you add a test script to book-database-mcp-server/package.json and configure it to run the tests?
```

### Step 4: Add Schema Validation Tests

```
#file:book-database-mcp-server/src/schemas/book.schemas.ts

Generate tests for the Zod schemas. Test:
- GetBookByIsbnSchema: valid 10-char ISBN passes, 9-char fails, empty fails
- GetBookByTitleSchema: valid title passes, empty fails, 501-char fails
- GetBooksByIsbnListSchema: valid list passes, empty list fails, >50 items fails
- GetBooksByTitlesSchema: valid list passes, empty list fails
```

### Validation

*   Service tests created and pass
*   Schema validation tests created and pass
*   Tests use real data values from the JSON files
*   Both found and not-found scenarios covered

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Tests fail immediately | Check test file imports and data setup |
| Agent generates tests that don't match project patterns | Add more context: `#file:tests/auth.test.js` as an example |
| Coverage doesn't increase | Verify tests actually exercise the route code, not just mock everything |
