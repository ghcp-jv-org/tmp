# Lab: Test-Driven Development with Custom Agents

> [!NOTE]
> This lab extends the **Custom Agents** lab (`custom-agents-exercise.md`). Complete that lab first so you have a `.github/agents/` folder ready.

## Overview

Test-driven development (TDD) means writing tests **before** code. You create three custom agents - one per TDD phase - and connect them with handoffs so you can click through the cycle:

```
  RED              GREEN             REFACTOR
  Write failing     Make tests        Improve code
  tests         ->  pass          ->  quality
       ^                                   |
       +--------- Start next cycle --------+
```

1. **Red** - Write a failing test
2. **Green** - Write minimal code to pass it
3. **Refactor** - Clean up without breaking tests

### Prerequisites

| Requirement | Details |
| --- | --- |
| **VS Code** | With GitHub Copilot extension (Agent Mode enabled) |
| **GitHub Copilot** | Pro, Pro+, Business, or Enterprise |
| **Prior lab** | Custom Agents lab completed (`.github/agents/` folder exists) |
| **App running** | `npm install && npm start` in `copilot-agent-and-mcp/` |
| **Tests passing** | `npm run test:backend` (all green) |

### Time Estimate

30 - 45 minutes

---

## Part 1 - Set Up Testing Guidelines (5 min)

Create a custom instructions file so the AI follows your test conventions automatically.

### Exercise 1.1 - Create the Testing Instructions File

Create `.github/instructions/testing.instructions.md`:

> **Tip:** You can also run `Chat: Create Instructions File` from the Command Palette (`Ctrl+Shift+P`), select `.github/instructions`, and enter "testing" as the name.

```markdown
---
description: 'Use these guidelines when generating or updating tests.'
applyTo: '**/tests/**,**/cypress/**'
---

# Testing Guidelines

## Frameworks
- **Backend**: Jest - tests in `backend/tests/`, run with `npm run test:backend`
- **E2E**: Cypress - tests in `frontend/cypress/e2e/`, run with `npm run build:frontend && npm run test:frontend`

## Conventions
* Always start comments with "generated-by-copilot: "
* One behavior per test - keep tests focused
* Use descriptive test names: `should return 400 when query is missing`
* Follow Arrange-Act-Assert (AAA) pattern
* Keep tests independent - no shared state between tests
* Cover: happy path, validation errors, auth errors, edge cases
```

### Exercise 1.2 - Verify It Loads

1. Open any file in `backend/tests/`.
2. Right-click in the Chat view > **Diagnostics**.
3. Confirm `testing.instructions.md` appears under **Instructions**.

---

## Part 2 - Create the Three TDD Agents (10 min)

You will create one agent per TDD phase. Each agent has a single job and hands off to the next.

### Exercise 2.1 - Create the Red Phase Agent

Create `.github/agents/TDD-red.agent.md`:

```markdown
---
description: "TDD Red phase - write FAILING tests. No implementation code."
name: TDD Red
tools: ['editFiles', 'search', 'codebase', 'terminalLastCommand']
handoffs:
  - label: "TDD Green - Make Tests Pass"
    agent: TDD Green
    prompt: |
      Make ALL the failing tests pass with minimal code.
      Do NOT modify test files. Run `npm run test:backend` after each change.
    send: false
---

# TDD Red Phase

You are a test-writer. Your ONLY job is to write tests that FAIL.

## Rules
1. **Only write test code.** Never write implementation code.
2. Tests must fail because the feature is missing, not because of syntax errors.
3. Always start comments with "generated-by-copilot: "
4. After writing tests, run `npm run test:backend` to confirm they fail.
5. Start with the simplest happy-path test, then add edge cases.
```

### Exercise 2.2 - Create the Green Phase Agent

Create `.github/agents/TDD-green.agent.md`:

```markdown
---
description: "TDD Green phase - write MINIMAL code to make tests pass."
name: TDD Green
tools: ['editFiles', 'search', 'codebase', 'terminalLastCommand']
handoffs:
  - label: "TDD Refactor - Improve Code Quality"
    agent: TDD Refactor
    prompt: |
      All tests pass. Improve code quality without changing behavior.
      Run `npm run test:backend` after each change.
    send: false
---

# TDD Green Phase

You are a code-implementer. Write the simplest code that makes the failing tests pass.

## Rules
1. **Do NOT modify test files.** Only write production code.
2. Write the minimum code needed - nothing extra.
3. Always start comments with "generated-by-copilot: "
4. Run `npm run test:backend` after each change.
5. Stop as soon as all tests pass.
```

### Exercise 2.3 - Create the Refactor Phase Agent

Create `.github/agents/TDD-refactor.agent.md`:

```markdown
---
description: "TDD Refactor phase - improve code quality. All tests must keep passing."
name: TDD Refactor
tools: ['editFiles', 'search', 'codebase', 'terminalLastCommand']
handoffs:
  - label: "TDD Red - Start Next Cycle"
    agent: TDD Red
    prompt: Start the next TDD cycle with new failing tests.
    send: false
  - label: "Done - Review Changes"
    agent: reviewer
    prompt: Review all changes for security and quality.
    send: false
---

# TDD Refactor Phase

You are a refactoring assistant. Improve code quality without changing behavior.

## Rules
1. **All tests must keep passing.** Run `npm run test:backend` after every change.
2. Do NOT add new features - only improve existing code.
3. Always start comments with "generated-by-copilot: "
4. Apply one refactoring at a time. If a test fails, revert immediately.

## What to look for
- Better variable/function names
- Duplicated code to extract
- Complex logic to simplify
- Hard-coded values to make constants
```

### Exercise 2.4 - Verify Agents Are Loaded

Open the **Agents** dropdown in the Chat view. You should see **TDD Red**, **TDD Green**, and **TDD Refactor** listed alongside any agents from the custom agents lab.

---

## Part 3 - Run Your First TDD Cycle (15 min)

Build a book search endpoint using the Red -> Green -> Refactor cycle.

### Exercise 3.1 - Red Phase: Write Failing Tests

1. Select the **TDD Red** agent from the Agents dropdown.
2. Enter this prompt:

> "Write failing tests for a GET /api/books/search endpoint. It should accept a `q` query parameter and return books whose title matches (case-insensitive, partial match). Test: (1) returns matching books, (2) returns empty array for no matches, (3) returns 400 if `q` is missing."

3. Wait for the agent to create the test file and run `npm run test:backend`.

**Check:**
- [ ] New test file created in `backend/tests/`
- [ ] Tests FAIL (because the endpoint doesn't exist yet)
- [ ] The **"TDD Green - Make Tests Pass"** button appears

### Exercise 3.2 - Green Phase: Make Tests Pass

1. Click the **"TDD Green - Make Tests Pass"** button.
2. The agent writes a search route in `backend/routes/index.js`.

**Check:**
- [ ] Test files were NOT modified
- [ ] ALL tests pass (new + existing)
- [ ] The **"TDD Refactor - Improve Code Quality"** button appears

### Exercise 3.3 - Refactor Phase: Clean Up

1. Click the **"TDD Refactor - Improve Code Quality"** button.
2. The agent improves naming, structure, or removes duplication.

**Check:**
- [ ] ALL tests still pass
- [ ] Code is cleaner than before
- [ ] The **"TDD Red - Start Next Cycle"** button appears

### Exercise 3.4 - Review Results

1. Open `backend/tests/search.test.js` - are the tests readable?
2. Open `backend/routes/index.js` - is the implementation clean?
3. Run `npm run test:backend` to confirm everything passes.

---

## Part 4 - Second TDD Cycle: Edge Cases (10 min)

### Exercise 4.1 - Red: Add Edge Case Tests

1. Click **"TDD Red - Start Next Cycle"** (or select TDD Red from the dropdown).
2. Enter:

> "Add failing tests for edge cases: (1) whitespace-only query returns 400, (2) special characters don't crash, (3) very long query returns 400."

3. Confirm the new tests fail.

### Exercise 4.2 - Green: Add Validation

1. Click **"TDD Green - Make Tests Pass"**.
2. The agent adds input validation.
3. Confirm all tests pass.

### Exercise 4.3 - Refactor: Polish

1. Click **"TDD Refactor - Improve Code Quality"**.
2. Confirm all tests still pass after cleanup.

---

## Part 5 - Connect the Planner (Optional, 5 min)

Add a handoff from the Planner agent (from the custom agents lab) so you can plan first, then jump into TDD.

Edit `.github/agents/planner.agent.md` and add this handoff:

```yaml
handoffs:
  - label: "Start TDD Red - Write Tests First"
    agent: TDD Red
    prompt: Based on the plan above, write failing tests for the first feature.
    send: false
```

Test it:

1. Select the **Planner** agent.
2. Ask it to plan a rating feature.
3. Click **"Start TDD Red - Write Tests First"** and walk through the cycle.

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Tests pass in Red phase | The feature already exists. Pick something not yet implemented. |
| Red agent writes implementation | Re-prompt: "Only write test code, not implementation." |
| Green agent edits test files | Re-prompt: "Do NOT modify test files." |
| Tests fail after refactoring | Revert the last change - it changed behavior. |
| Handoff button missing | Check that the `agent` name in the handoff matches exactly (case-sensitive). |

---

## Common Pitfalls

| Pitfall | How to Avoid |
| --- | --- |
| AI skips straight to implementation | Use separate agents - the Red agent only has instructions to write tests |
| Green phase writes too much code | Review the diff - it should be minimal, just enough to pass |
| Tests break during refactoring | Tests should verify behavior (inputs/outputs), not implementation details |
| AI only tests the happy path | Explicitly ask for edge cases and error conditions in your Red phase prompt |

---

## Bonus Challenges

### Challenge 1 - TDD for Frontend

Create a Cypress variant of the TDD Red agent. Use `npm run build:frontend && npm run test:frontend` as the run command. Add a search UI component and TDD it.

### Challenge 2 - Scoped Hooks

Add agent-scoped hooks to enforce discipline. Example for `TDD-green.agent.md`:

```yaml
hooks:
  PostToolUse:
    - type: command
      command: "npm run test:backend --silent"
      timeout: 60
```

This auto-runs tests after every file edit so the Green agent can't forget.

---

## Key Takeaways

| Concept | What You Learned |
| --- | --- |
| **Phase discipline** | Separate agents keep each phase focused on one job |
| **Handoffs** | One-click transitions let you review before moving on |
| **Tests first** | Tests define expected behavior before any code is written |
| **Minimal code** | Green phase writes just enough to pass - no over-engineering |
| **Safe refactoring** | Passing tests act as a safety net during cleanup |

## Reference

- [VS Code TDD Guide](https://code.visualstudio.com/docs/copilot/guides/test-driven-development-guide)
- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Agent Hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
