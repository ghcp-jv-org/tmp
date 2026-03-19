# Lab 10 - Multi-Agent Development & Governance

> **Mode:** GitHub.com  
> **Duration:** 45 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md)

---

## Objective

Compare multiple AI agents on identical tasks, inspect agent session logs, and configure governance policies for agent-driven development.

| Exercise | Skill | What You Learn |
|-----|----|--------|
| 1 | **Agent comparison** | Assign the same task to different agents and compare PRs - learn how agents differ in approach, quality, and conventions |
| 2 | **Observability** | Read agent session logs and Actions workflow traces - understand what the agent did, why, and how long it took |
| 3 | **Governance policies** | Add rules to `copilot-instructions.md` and test compliance - learn to constrain agent behavior for enterprise use |

---

## Exercise 1: Agent Comparison - Same Task, Different Agents

> **Purpose:** Assign an identical, well-defined issue to multiple agents (or the same agent twice) and compare the results. Evaluate: approach, code quality, test coverage, PR description. This teaches agent selection - when to use which agent and how to evaluate output objectively.

### Step 1: Define a Standard Task

Create an issue for a self-contained feature:

```
Title: Add pagination to the book list

Description:
Implement pagination for the book list:
- Backend: GET /api/books accepts ?page=1&limit=10 query parameters
- Backend: Response includes { books: [], totalPages, currentPage }
- Frontend: Add Previous/Next buttons below the book list
- Frontend: Show "Page X of Y" indicator
- Include unit tests for the pagination logic
```

### Step 2: Assign to Copilot

1. Assign the issue to **Copilot**
2. Wait for the PR (~5-7 minutes)
3. **Do not merge** - leave the PR open for comparison

### Step 3: Create a Duplicate Task for Another Agent (if available)

If your repository has access to another agent (Claude, Codex, etc.):

1. Create a second identical issue
2. Assign to the alternate agent
3. Wait for its PR

If only Copilot is available, skip to Exercise 2.

### Step 4: Compare Results

For each PR, evaluate:

| Criteria | Agent 1 (Copilot) | Agent 2 (Other) |
|-----|----------|---------|
| Files changed | | |
| Backend approach | | |
| Frontend approach | | |
| Test coverage | | |
| Code quality | | |
| Follows project conventions | | |
| PR description quality | | |

### Validation

- [ ] At least one agent PR generated
- [ ] PR reviewed against criteria above
- [ ] Differences noted (if multi-agent available)

---

## Exercise 2: Observability - Agent Session Logs and Workflow Traces

> **Purpose:** Inspect what the agent actually did during its run. Read the PR timeline for reasoning, the Actions workflow for execution logs, and note file reads, tool calls, and test runs. This teaches you to debug agent behavior - essential when an agent produces unexpected output.

### Step 1: View Agent Activity

1. Open the PR created by Copilot in Exercise 1
2. Scroll through the **PR timeline**
3. Identify:

| Log Entry | What It Shows |
|------|-------|
| Agent start | When the agent began working |
| File reads | Which files the agent inspected |
| Tool calls | Commands the agent ran (tests, lint) |
| File writes | Which files were created/modified |
| Reasoning | Why the agent made specific decisions |

### Step 2: View Actions Workflow Logs

1. Go to **Actions** tab
2. Find the workflow run for this PR
3. Expand each step and note:
   - Runner provisioning time
   - Setup steps execution
   - Agent processing time
   - Test execution results

### Step 3: Document Findings

Note:
- Total time from issue assignment to PR creation
- Number of files the agent read vs. modified
- Whether the agent ran tests before submitting
- Any errors or retries visible in logs

### Validation

- [ ] PR timeline reviewed
- [ ] Agent reasoning visible in timeline
- [ ] Actions workflow logs inspected
- [ ] Processing time and file counts noted

---

## Exercise 3: Governance Policies - Constraining Agent Behavior

> **Purpose:** Add governance rules to `.github/copilot-instructions.md` (require planning comments, mandate tests, restrict directories) and test whether the agent complies. This teaches policy-driven agent management - the controls enterprises need before deploying agents at scale.

### Step 1: Add Governance Rules

Edit `.github/copilot-instructions.md` to add governance constraints:

```markdown
## Agent Governance Rules

1. **Planning First**: Before implementing any changes, create a comment on the issue
   listing all files you plan to modify and why. Wait for approval before proceeding.

2. **Test Requirement**: Every code change must include corresponding unit tests.
   Do not submit a PR without test coverage for new functionality.

3. **Scope Limits**: Do not modify files in the following directories without
   explicit mention in the issue:
   - .github/workflows/
   - infrastructure/
   - deployment/

4. **Code Style**: All new code must follow these conventions:
   - Use async/await (no callbacks or raw promises)
   - Add JSDoc comments for all exported functions
   - Use descriptive variable names (no single letters except loop indices)

5. **PR Requirements**: PR description must include:
   - Summary of changes
   - List of files modified
   - Test commands to verify
```

### Step 2: Commit and Push

```bash
git add .github/copilot-instructions.md
git commit -m "Add agent governance rules"
git push
```

### Step 3: Test Governance Compliance

Create a new issue:

```
Title: Add a "Recently Viewed" section to the homepage

Description:
Track the last 5 books a user viewed and display them in a "Recently Viewed" section
on the homepage. Include backend storage and frontend display.
```

Assign to Copilot.

### Step 4: Verify Compliance

When the PR is created, check:

- [ ] Did the agent comment on the issue with a plan first?
- [ ] Does the PR include unit tests?
- [ ] Does the PR description follow the required format?
- [ ] Does the code use async/await?
- [ ] Are JSDoc comments present on exported functions?

> **Note:** Governance instructions are hints, not hard constraints. The agent may not follow all rules perfectly. Document which rules it followed and which it didn't.

### Validation

- [ ] Governance rules added to `copilot-instructions.md`
- [ ] New issue created and assigned
- [ ] Agent compliance evaluated against each rule
- [ ] Compliance findings documented

---

## Troubleshooting

| Issue | Fix |
|----|---|
| Only one agent available | Complete Exercise 1 with Copilot only; skip comparison |
| Agent ignores governance rules | Rules are advisory - document non-compliance for discussion |
| PR timeline is sparse | Check if the Actions workflow ran successfully |
| Agent doesn't plan first | This is a known limitation - the agent may proceed directly |
