# Lab 08 - CI/CD Pipeline Generation

> **Mode:** VS Code + GitHub.com  
> **Duration:** 45 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md)

---

## Objective

Use Copilot to generate, extend, and validate GitHub Actions CI/CD workflows. This is core Agentic DevOps - AI agents modifying pipeline YAML as part of automation.

| Exercise | Skill | What You Learn |
| --- | --- | --- |
| 1 | **Pipeline generation** | Generate a CI workflow from scratch via Agent Mode - learn how the agent maps your project structure to YAML steps |
| 2 | **Pipeline extension via Coding Agent** | Use a GitHub issue to add quality gates to an existing pipeline - the agent modifies YAML without breaking existing steps |
| 3 | **Deployment stage design** | Generate a deployment workflow with environment protection and job dependencies - learn CI/CD patterns the agent applies |

---

## Exercise 1: Pipeline Generation - CI Workflow from Scratch

> **Purpose:** Generate a complete CI workflow from a codebase-aware prompt. The agent reads your project structure (Node.js, backend tests, frontend build) and maps it to GitHub Actions YAML. You verify the output matches what you’d write manually.

### Step 1: Open Agent Mode

Open Copilot Chat in Agent Mode in VS Code.

### Step 2: Generate the Workflow

```
#codebase

Generate a GitHub Actions CI workflow at .github/workflows/ci.yml that:
1. Triggers on push and pull_request to main
2. Runs on ubuntu-latest with Node.js 20
3. Installs root and frontend dependencies
4. Runs backend tests (npm run test:backend)
5. Builds the frontend (cd frontend && npm run build)
6. Caches node_modules for faster runs

Use npm ci for installs. Add appropriate step names.
```

### Step 3: Review the Generated YAML

Open `.github/workflows/ci.yml` and verify:

```
# Expected structure:
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - working-directory: frontend
        run: npm ci
      - run: npm run test:backend
      - working-directory: frontend
        run: npm run build
```

### Step 4: Commit and Push

Run manually:

```
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

Or ask Copilot in Agent Mode:

```
Commit the new CI workflow file and push it to the remote repository.
```

### Step 5: Verify

1.  Go to GitHub.com → **Actions** tab
2.  Confirm the workflow runs and passes

### Validation

*   `ci.yml` created with correct triggers
*   Node.js 20 setup included
*   Backend tests and frontend build steps present
*   Workflow runs and passes on GitHub

---

## Exercise 2: Pipeline Extension - Quality Gates via Coding Agent

> **Purpose:** Extend an existing workflow without breaking it. Assign an issue to the Coding Agent asking for lint, coverage, and badge steps. The agent reads the current `ci.yml`, adds new steps in the right place, and opens a PR. This teaches incremental pipeline evolution via issues.

### Step 1: Create the Issue

On GitHub.com in **Copilot Chat**:

```
Create an issue with:
- Title: Add quality gates to CI pipeline
- Body: Enhance the CI workflow (.github/workflows/ci.yml) to include:
  1. ESLint check for the frontend (cd frontend && npx eslint src/)
  2. A test coverage report step
  3. A step that fails if backend test coverage drops below 50%
  4. Add status badges to README.md
  Keep existing steps. Add new steps after the current ones.
```

### Step 2: Assign to Copilot

1.  Assign to **Copilot**
2.  Wait for 👀 reaction
3.  Monitor in **Actions** tab

### Step 3: Review the PR

Check:

*   New steps added to `ci.yml` (not replacing existing)
*   Lint step runs ESLint
*   Coverage step generates a report
*   README updated with badge
*   Workflow YAML is valid

### Step 4: Test the Updated Pipeline

Merge the PR and verify the enhanced workflow runs.

### Validation

*   Issue created and assigned
*   PR adds lint, coverage, and badge steps
*   Existing steps preserved
*   Updated workflow passes

---

## Exercise 3: Deployment Stage - Environment Protection and Job Dependencies

> **Purpose:** Generate a deployment workflow that introduces advanced patterns: job dependencies (`needs:`), environment protection rules (`environment: staging`), and sequential deploy steps. This teaches CI/CD patterns the agent applies - you learn the patterns by reviewing the generated YAML.

### Step 1: Generate a Deployment Workflow

In Agent Mode:

```
#codebase

Create a new GitHub Actions workflow at .github/workflows/deploy.yml that:
1. Triggers only on push to main (not on PRs)
2. First runs the CI job (reuse the ci.yml workflow using workflow_call or repeat steps)
3. Then has a deploy job that:
   - Only runs if CI passes
   - Uses a "staging" environment with manual approval
   - Echoes deployment steps as placeholders:
     * "Building production bundle..."
     * "Deploying to staging..."
     * "Running smoke tests..."
     * "Deployment complete"
4. Add appropriate needs: and environment: settings
```

### Step 2: Review

Verify the workflow has:

*   Proper job dependencies (`needs: ci`)
*   Environment protection rules (`environment: staging`)
*   Sequential deployment steps

### Step 3: Commit

Run manually:

```
git add .github/workflows/deploy.yml
git commit -m "Add deployment workflow"
git push
```

Or ask Copilot in Agent Mode:

```
Commit the new deployment workflow file and push it to the remote repository.
```

### Validation

*   `deploy.yml` created
*   CI → Deploy job dependency configured
*   Environment protection rule set
*   Workflow syntax is valid (check Actions tab)

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Workflow YAML syntax error | Paste the error into Agent Mode: "Fix this YAML error: ..." |
| Workflow doesn't trigger | Check branch name matches (`main` vs `master`) |
| Lint step fails | That's expected - fix lint errors or adjust the rule |
| Coverage step fails | Adjust the threshold or add more tests first |
