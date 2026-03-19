# Lab 07 - Code Modernization & Refactoring

> **Mode:** VS Code + GitHub.com  
> **Duration:** 45 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md)

---

## Objective

Use Copilot to modernize legacy patterns, refactor code, and upgrade dependencies. Demonstrates AI-assisted code transformation across multiple files.

| Exercise | Skill | What You Learn |
|-----|----|--------|
| 1 | **Pattern modernization** | Refactor callbacks/promises to async/await across all routes - learn how the agent applies consistent transforms across many files |
| 2 | **Dependency upgrade** | Use Agent Mode to plan and execute a dependency upgrade - it identifies breaking changes and updates code to match |
| 3 | **Configuration externalization** | Extract hardcoded values (port, paths) into a centralized config module - a structural refactor, not just a code style change |
| 4 | **Extend an existing system** | Add a new tool to the MCP server following its existing architecture - learn to extend code by having the agent follow established patterns |

---

## Exercise 1: Pattern Modernization - Callbacks to Async/Await

> **Purpose:** Apply a consistent code pattern across every route handler in the backend. The agent identifies all callback-style or `.then()` patterns, transforms them to `async/await`, and standardizes error handling. This teaches batch refactoring - the agent applies the same transform repeatedly without getting bored or inconsistent.

### Step 1: Identify Callback Patterns

In Agent Mode:

```
#codebase

List all route handlers in the backend that use callback-style patterns, nested .then() chains, or inconsistent error handling. Show the file and line number for each.
```

Review the list. Note which files use older patterns.

### Step 2: Refactor to Modern Patterns

```
#codebase

Refactor all backend route handlers to use async/await with consistent error handling:
- Convert any callback-style code to async/await
- Convert .then()/.catch() chains to try/catch with await
- Add a consistent error response format: { error: true, message: "..." }
- Preserve existing functionality
```

### Step 3: Review Changes

Check each modified file:
- Route handlers use `async (req, res)` signature
- `try/catch` blocks wrap async operations
- Error responses follow the consistent format
- No functionality changed - only patterns updated

### Step 4: Test

```bash
npm run test:backend
```

Then test manually in the browser to verify all features still work.

### Validation

- [ ] Callback/then patterns identified
- [ ] Routes refactored to async/await
- [ ] Error handling is consistent
- [ ] All tests pass
- [ ] App functions correctly

---

## Exercise 2: Dependency Upgrade - Identify and Fix Breaking Changes

> **Purpose:** Upgrading dependencies is tedious and risky. Use Agent Mode to identify outdated packages, understand breaking changes, update `package.json`, and fix any code that uses deprecated APIs. This teaches using AI for the research-heavy part of upgrades - finding what broke and why.

### Step 1: Check for Outdated Packages

```bash
npm outdated -prefix backend
```

Note any outdated packages.

### Step 2: Request an Upgrade Plan

In Agent Mode:

```
#codebase

I want to upgrade the backend dependencies. Based on the current package.json:
1. List each outdated or deprecated dependency
2. For each, explain what breaking changes exist in the newer version
3. Update package.json to use the latest compatible versions
4. Update any code that uses deprecated APIs
```

### Step 3: Review and Apply

1. Review the dependency changes in `package.json`
2. Check any code changes for deprecated API updates
3. Accept the changes

### Step 4: Install and Test

```bash
npm install
npm run test:backend
```

Verify the app works with updated dependencies.

### Validation

- [ ] Outdated dependencies identified
- [ ] `package.json` updated
- [ ] Breaking API changes addressed in code
- [ ] All tests pass after upgrade

---

## Exercise 3: Configuration Externalization - Hardcoded Values to Config Module

> **Purpose:** This is a structural refactor, not a style change. Extract hardcoded port numbers, paths, and magic values into a centralized config module that reads from environment variables. The agent creates the module, updates all references, and generates `.env.example`. This teaches refactoring for operability - making the app configurable without code changes.

### Step 1: Find Hardcoded Configuration

```
#codebase

Find all hardcoded configuration values in the backend:
- Port numbers
- File paths
- Timeout values
- Feature flags
- Any magic numbers

Refactor them into a centralized config module that reads from environment variables with sensible defaults.
```

### Step 2: Review Changes

Copilot should create/modify:

| File | Change |
|---|----|
| `config.js` (new) | Centralized config reading from `process.env` |
| `server.js` | Uses `config.port` instead of hardcoded `3001` |
| Route files | Use config values instead of magic numbers |
| `.env.example` | Lists all configuration variables |

### Step 3: Test with Default Config

```bash
npm start
```

App should work with defaults (no `.env` file needed).

### Step 4: Test with Custom Config

Create `.env`:

```
PORT=3002
```

Restart:

```bash
npm start
```

**Expected:** Server starts on port 3002.

### Validation

- [ ] Hardcoded values found and listed
- [ ] Centralized config module created
- [ ] `.env.example` documents all variables
- [ ] App works with defaults
- [ ] App works with custom env values

---

## Exercise 4: Extend an Existing System - Add a Search Tool to the MCP Server

> **Purpose:** Add a new `search_books` tool to the MCP server by following its existing architecture (schemas, services, tools). This teaches the agent to read and replicate established patterns in an unfamiliar codebase - the same skill developers use when contributing to a project for the first time.

Use Agent Mode to add a new capability to the `book-database-mcp-server`.

### Step 1: Review Existing Patterns

Open the MCP server files to understand the architecture:

```
#file:book-database-mcp-server/src/tools/books.ts
#file:book-database-mcp-server/src/services/book.service.ts
#file:book-database-mcp-server/src/schemas/book.schemas.ts
#file:book-database-mcp-server/src/types.ts
```

### Step 2: Request a New Tool

```
#file:book-database-mcp-server/src/tools/books.ts
#file:book-database-mcp-server/src/services/book.service.ts
#file:book-database-mcp-server/src/schemas/book.schemas.ts

Add a new MCP tool called "search_books" to the book-database-mcp-server that:
- Accepts a query string parameter (partial match, 1-200 chars)
- Searches both title and author fields in books.json
- Returns matching books (case-insensitive, partial match)
- Returns max 20 results

Follow the existing patterns:
1. Add a Zod schema in book.schemas.ts (SearchBooksSchema)
2. Add a service function in book.service.ts (searchBooks)
3. Register the tool in tools/books.ts with proper MCP annotations
4. Use the same formatting pattern as existing tools
```

### Step 3: Review the Changes

Verify Copilot followed the architecture:

| File | Expected Change |
|---|--------|
| `schemas/book.schemas.ts` | New `SearchBooksSchema` with query string validation |
| `services/book.service.ts` | New `searchBooks()` function with case-insensitive filtering |
| `tools/books.ts` | New tool registered with `server.registerTool("search_books", ...)` |

Check that:
- Zod schema validates min 1 / max 200 characters
- Search is case-insensitive (uses `.toLowerCase()` or similar)
- Results capped at 20
- MCP annotations include `readOnlyHint: true`

### Step 4: Build and Test

```bash
cd book-database-mcp-server
npm run build
```

**Expected:** No TypeScript errors.

### Step 5: Test via Agent Mode

Restart the MCP server, then in Agent Mode:

```
Using the book-database MCP server, search for books with "the" in the title. Show the results.
```

**Expected:** Copilot calls `search_books` and returns matching books (e.g., "The Great Gatsby", "To Kill a Mockingbird").

### Validation

- [ ] Schema, service, and tool files all updated
- [ ] Follows existing code patterns (not a different style)
- [ ] `npm run build` succeeds with no errors
- [ ] Search tool works via Agent Mode
- [ ] Partial + case-insensitive matching works

---

## Troubleshooting

| Issue | Fix |
|----|---|
| Refactored code changes behavior | Compare before/after with `git diff`, ask Copilot to fix |
| npm install fails after upgrade | Check for peer dependency conflicts |
| Config module not found | Verify the import path matches the new file location |
