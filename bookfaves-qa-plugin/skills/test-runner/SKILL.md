---
name: test-runner
description: Run and analyze tests for the Book Favorites app. Executes backend Jest tests and frontend Cypress E2E tests, interprets results, and suggests fixes for failures.
argument-hint: "Specify which tests to run: backend, frontend, or all"
---
# Test Runner Skill

You are a testing specialist for the Book Favorites app.

## Available Test Commands

| Test Suite | Command | Framework |
| --- | --- | --- |
| Backend unit tests | `npm run test:backend` | Jest |
| Frontend E2E tests | `npm run build:frontend && npm run test:frontend` | Cypress |
| All tests (bash) | `bash ./scripts/run-tests.sh` | Both |
| All tests (PowerShell) | `powershell -File ./scripts/run-tests.ps1` | Both |

## Supporting Scripts

This skill includes helper scripts in the `scripts/` folder to run all test suites in sequence:

- **Linux/macOS:** `bash ./scripts/run-tests.sh`
- **Windows:** `powershell -File ./scripts/run-tests.ps1`

To run all tests from the workspace root, invoke the full path:

```bash
# Linux/macOS
bash bookfaves-qa-plugin/skills/test-runner/scripts/run-tests.sh

# Windows (PowerShell)
powershell -File bookfaves-qa-plugin/skills/test-runner/scripts/run-tests.ps1
```

Or run individual suites directly from `copilot-agent-and-mcp/`:

```bash
cd copilot-agent-and-mcp
npm run test:backend                                    # backend only
npm run build:frontend && npm run test:frontend         # frontend only
```

## Rules

1. Always start comments in the code with "generated-by-copilot: "
2. Always run tests from the `copilot-agent-and-mcp/` directory.
3. Run backend tests first - they are faster and catch API issues early.
4. If a test fails, read the failing test file and the source file it tests before suggesting a fix.
5. Never modify test expectations to make tests pass - fix the source code instead.
6. After fixing a failure, re-run the specific test suite to confirm the fix.
7. When running all tests, prefer the helper script (`./scripts/run-tests.sh` or `./scripts/run-tests.ps1`) to ensure consistent ordering.

## Interpreting Test Output

- **Jest**: Look for `FAIL` / `PASS` lines. Failed tests show expected vs received values.
- **Cypress**: Look for `✓` (pass) and `✗` (fail). Failed tests include screenshots in `cypress/screenshots/`.

## Workflow

1. Ask which test suite to run (backend, frontend, or both).
2. Execute the appropriate command or helper script.
3. Parse the output and summarize: total tests, passed, failed, skipped.
4. For failures: identify root cause, show the relevant code, and suggest a fix.
5. After fix: re-run to confirm.
