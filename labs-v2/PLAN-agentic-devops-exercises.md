# Agentic DevOps Exercises - Development Plan

> **generated-by-copilot:** Master plan for developing agentic DevOps exercises using GitHub Copilot (VS Code Agent Mode) and GitHub.com (Copilot coding agent). All exercises use the **Book Favorites** app (`copilot-agent-and-mcp/`) and the **Book Database MCP Server** (`book-database-mcp-server/`) as the shared codebase.

---

## Plan Overview

This plan defines a progressive series of hands-on labs that teach developers how to use GitHub Copilot's agentic capabilities across the full DevOps lifecycle — from coding and testing to CI/CD, infrastructure, security, and SRE operations. Each lab builds on prior labs and uses the same Book Favorites app to keep context familiar.

### Target Audience

- Developers with basic GitHub Copilot experience
- DevOps engineers exploring AI-assisted workflows
- Teams evaluating Copilot for enterprise adoption

### Shared Source Code

| Component | Path | Stack |
| --- | --- | --- |
| **Book Favorites App** | `copilot-agent-and-mcp/` | Express.js backend, React + Redux frontend, Cypress E2E, Jest unit tests |
| **Book Database MCP Server** | `book-database-mcp-server/` | TypeScript MCP server, Zod schemas, stdio transport |
| **CI Workflow** | `copilot-agent-and-mcp/.github/workflows/ci.yml` | GitHub Actions — backend tests, frontend build, E2E tests |
| **Coding Agent Setup** | `copilot-agent-and-mcp/.github/workflows/copilot-setup-steps.yml` | Environment setup for Copilot coding agent on GitHub.com |

### Lab Progression

```
Foundation (VS Code)                    DevOps (VS Code + GitHub.com)
────────────────────                    ─────────────────────────────
Lab 00: Custom Instructions      ──┐
Lab 01: Custom Agents               │   Lab 07: Test Generation
Lab 02: Hooks                        ├─► Lab 08: Code Modernization
Lab 03: Skills                       │   Lab 09: CI/CD Generation
Lab 04: Plugins                      │   Lab 10: Infrastructure as Code
Lab 05: MCP Builder              ──┤   Lab 11: Multi-Agent Governance
Lab 06: MCP Data                  ──┘   Lab 12: SRE Agent
                                         Lab 13: Copilot Coding Agent on GitHub.com
```

---

## Existing Labs (00–06) — Summary

These labs are already developed. New labs (07+) build on the artifacts and skills taught here.

| Lab | File | Topic | Key Artifacts Produced | Duration |
| --- | --- | --- | --- | --- |
| 00 | `00-custom-instructions-exercise.md` | Custom Instructions | `copilot-instructions.md`, `react.instructions.md`, `express.instructions.md`, `testing.instructions.md`, `css.instructions.md` | 45 min |
| 01 | `01-custom-agents-exercise.md` | Custom Agents | Planner, Implementer, Reviewer, Feature Builder agents | 65 min |
| 02 | `02-hooks-exercise.md` | Agent Hooks | Auto-format hook (`PostToolUse`), security guard hook (`PreToolUse`) | 30 min |
| 03 | `03-skills-exercise.md` | Agent Skills | Data Seeder skill, Test Fixture Generator skill | 30 min |
| 04 | `04-plugins-exercise.md` | Agent Plugins | `bookfaves-qa-plugin` with bundled skill, agent, and hook | 35 min |
| 05 | `05-mcp-builder.md` | MCP Builder | `book-database-mcp-server/` — full TypeScript MCP server | 45–60 min |
| 06 | `06-mcp-data.md` | MCP Data | Staff Picks feature, MCP-driven test data, new MCP tool | 45–60 min |

### Artifacts Available After Lab 06

```
copilot-agent-and-mcp/
├── .github/
│   ├── copilot-instructions.md          ← Lab 00
│   ├── instructions/                     ← Lab 00 (react, express, testing, css)
│   ├── agents/                           ← Lab 01 (Planner, Implementer, Reviewer, Feature Builder)
│   ├── hooks/                            ← Lab 02 (format, security)
│   ├── skills/                           ← Lab 03 (seeding-test-data, test-fixtures) + Lab 05 (mcp-builder)
│   └── workflows/
│       ├── ci.yml                        ← existing CI
│       └── copilot-setup-steps.yml       ← coding agent setup
├── backend/
│   ├── routes/ (auth, books, favorites, readingList, staffPicks)
│   ├── tests/ (auth, books, books-edge-cases, favorites, readingList)
│   └── data/ (books.json, users.json)
├── frontend/
│   ├── src/components/ (BookList, Favorites, ReadingList, Login, Register, etc.)
│   ├── src/store/ (Redux slices)
│   └── cypress/e2e/ (login, books_list, book_favorites, reading_list)
└── book-database-mcp-server/
    └── src/ (TypeScript MCP server with 4 tools)
```

---

## New Labs to Develop (07–13)

### Lab 07: Test Generation

> **File:** `07-test-generation.md`
> **Mode:** VS Code (Agent Mode) + GitHub.com (Copilot coding agent)
> **Duration:** 45–60 min
> **Prerequisites:** Labs 00–02 (instructions, agents, hooks)

#### Objective

Use GitHub Copilot to generate, fix, and extend tests for the Book Favorites app. Work across unit tests (Jest + supertest), E2E tests (Cypress), and use the Copilot coding agent on GitHub.com to fix failing tests via issue assignment.

#### Exercises

| # | Title | Description | Tools / Mode |
| --- | --- | --- | --- |
| 1 | **Fix failing E2E tests** | The `reading_list.cy.js` E2E test fails because registration returns 409 ("User already exists") on repeat runs. Use Agent Mode to diagnose the root cause (non-unique usernames across test runs, test data not resetting) and fix the test to use truly unique credentials per test or add proper setup/teardown. | VS Code Agent Mode |
| 2 | **Generate backend unit tests** | Use the Implementer agent (Lab 01) to generate missing tests for `readingList.test.js` edge cases: duplicate additions, invalid status transitions, empty reading lists, and pagination. Use the `testing.instructions.md` (Lab 00) to enforce conventions. | VS Code Agent Mode + custom agents |
| 3 | **Generate E2E test from OpenAPI spec** | The app has an `openapi.yaml` spec. Prompt Copilot to read the spec and generate a new Cypress E2E test file `staff_picks.cy.js` that validates the staff picks feature from Lab 06. | VS Code Agent Mode |
| 4 | **Fix tests via Copilot coding agent** | Create a GitHub issue describing a test failure. Assign Copilot (`@copilot`) to the issue and let the coding agent generate a fix PR using `copilot-setup-steps.yml` for environment setup. Review the PR and iterate. | GitHub.com |

#### Key Learning Outcomes

- Diagnosing and fixing flaky E2E tests with Agent Mode
- Using custom instructions and agents to enforce test conventions
- Generating tests from API specifications
- Delegating test fixes to the Copilot coding agent on GitHub.com

#### Source Files Involved

- `copilot-agent-and-mcp/frontend/cypress/e2e/reading_list.cy.js` — failing E2E test
- `copilot-agent-and-mcp/backend/tests/readingList.test.js` — backend unit tests
- `copilot-agent-and-mcp/backend/openapi.yaml` — API specification
- `copilot-agent-and-mcp/backend/routes/staffPicks.js` — Staff Picks route (Lab 06)
- `copilot-agent-and-mcp/.github/workflows/copilot-setup-steps.yml` — coding agent environment

---

### Lab 08: Code Modernization

> **File:** `08-code-modernization.md`
> **Mode:** VS Code (Agent Mode)
> **Duration:** 45–60 min
> **Prerequisites:** Labs 00–01 (instructions, agents)

#### Objective

Use Copilot Agent Mode to modernize the Book Favorites backend — refactor patterns, improve security, add input validation, and update dependencies — while keeping all existing tests passing.

#### Exercises

| # | Title | Description | Tools / Mode |
| --- | --- | --- | --- |
| 1 | **Add input validation with Zod** | The backend routes accept user input without validation (`req.body`, `req.query`). Use Agent Mode to add Zod validation schemas to the `auth.js`, `books.js`, and `readingList.js` routes. Follow the pattern established in `book-database-mcp-server/src/schemas/`. Run `npm run test:backend` after each change. | VS Code Agent Mode |
| 2 | **Refactor server.js for separation of concerns** | `server.js` contains auth middleware, file helpers, and app config all in one file. Use the Planner agent to create a refactoring plan, then the Implementer agent to extract: (a) `utils/fileHelpers.js` for `readJSON`/`writeJSON`, (b) `middleware/auth.js` for `authenticateToken`, (c) `config/index.js` for constants. Verify with tests. | VS Code Agent Mode + custom agents |
| 3 | **Security hardening** | Use Agent Mode to add security headers (Helmet), rate limiting (express-rate-limit), and CORS configuration tightening. Use the security guard hook (Lab 02) to prevent the agent from modifying `.env` or secrets files during the session. | VS Code Agent Mode + hooks |
| 4 | **Dependency audit and update** | Prompt Copilot to run `npm audit`, analyze the results, and create a plan to update vulnerable dependencies. Use the Reviewer agent to validate the changes don't break the API contract (check `openapi.yaml`). | VS Code Agent Mode + custom agents |

#### Key Learning Outcomes

- Applying production security patterns (validation, headers, rate limiting) with AI assistance
- Using Planner → Implementer → Reviewer agent pipeline for safe refactoring
- Leveraging MCP server patterns (Zod schemas) in the main app
- Running tests as guardrails during modernization

#### Source Files Involved

- `copilot-agent-and-mcp/backend/server.js` — monolithic server setup
- `copilot-agent-and-mcp/backend/routes/*.js` — routes lacking validation
- `copilot-agent-and-mcp/backend/utils/apiUtils.js` — utility functions
- `book-database-mcp-server/src/schemas/book-schemas.ts` — Zod pattern reference

---

### Lab 09: CI/CD Generation

> **File:** `09-cicd-generation.md`
> **Mode:** VS Code (Agent Mode) + GitHub.com (Copilot coding agent)
> **Duration:** 45–60 min
> **Prerequisites:** Labs 00–01 (instructions, agents), existing `ci.yml`

#### Objective

Use Copilot to evolve the existing CI pipeline and generate new CD workflows — from a basic test-and-build workflow to a full CI/CD pipeline with staging, matrix testing, caching, and deployment.

#### Exercises

| # | Title | Description | Tools / Mode |
| --- | --- | --- | --- |
| 1 | **Analyze and improve existing CI** | The current `ci.yml` runs backend tests and E2E tests sequentially. Use Agent Mode to analyze the workflow and generate an improved version with: parallel jobs, npm caching, artifact uploads for Cypress screenshots, and status badges. | VS Code Agent Mode |
| 2 | **Add a PR validation workflow** | Generate a new workflow `pr-validation.yml` that runs on `pull_request` events: linting (ESLint), type checking (for the MCP server), test coverage reporting, and a comment with coverage diff on the PR. | VS Code Agent Mode |
| 3 | **Generate a deployment workflow** | Generate `deploy.yml` for deploying to a staging environment: build frontend, package backend, deploy to a cloud provider (Azure App Service or AWS), run smoke tests against the deployed URL. Use Context7 MCP to fetch latest GitHub Actions docs. | VS Code Agent Mode + Context7 MCP |
| 4 | **Enhance copilot-setup-steps.yml** | Improve the coding agent's setup workflow to also build the MCP server, configure test data, and run a validation smoke test. Then create an issue on GitHub.com and assign it to `@copilot` to verify the setup works. | VS Code + GitHub.com |

#### Key Learning Outcomes

- Iteratively improving CI/CD pipelines with Agent Mode
- Generating GitHub Actions workflows from natural language
- Configuring the Copilot coding agent environment
- Using Context7 MCP for up-to-date Actions syntax

#### Source Files Involved

- `copilot-agent-and-mcp/.github/workflows/ci.yml` — existing CI workflow
- `copilot-agent-and-mcp/.github/workflows/copilot-setup-steps.yml` — coding agent setup
- `copilot-agent-and-mcp/package.json` — npm scripts (`test:backend`, `test:frontend`)

---

### Lab 10: Infrastructure as Code

> **File:** `10-infrastructure-as-code.md`
> **Mode:** VS Code (Agent Mode)
> **Duration:** 45–60 min
> **Prerequisites:** Labs 00–01 (instructions, agents)

#### Objective

Use Copilot Agent Mode to generate Infrastructure as Code (IaC) for deploying the Book Favorites app and the MCP server. Cover Dockerfiles, Docker Compose, Terraform, and Kubernetes manifests.

#### Exercises

| # | Title | Description | Tools / Mode |
| --- | --- | --- | --- |
| 1 | **Generate Dockerfiles** | Use Agent Mode to generate production-ready Dockerfiles for: (a) the Express.js backend, (b) the React frontend (multi-stage with nginx), and (c) the MCP server. Follow best practices: non-root users, multi-stage builds, `.dockerignore`, health checks. | VS Code Agent Mode |
| 2 | **Generate Docker Compose** | Generate a `docker-compose.yml` that orchestrates all three services with networking, volume mounts for data persistence, environment variables, and health check dependencies. Include a dev profile with hot-reload. | VS Code Agent Mode |
| 3 | **Generate Terraform configuration** | Use the Planner agent to design the infrastructure, then the Implementer agent to generate Terraform configs for deploying to a cloud provider: a container registry, an app service or ECS cluster, networking, and environment secrets. | VS Code Agent Mode + custom agents |
| 4 | **Generate Kubernetes manifests** | Generate K8s manifests: Deployments, Services, ConfigMaps, Ingress, and HPA for auto-scaling. Use Agent Mode with Context7 MCP for latest K8s API references. Validate with `kubectl --dry-run`. | VS Code Agent Mode + Context7 MCP |

#### Key Learning Outcomes

- Generating production-quality container configurations with AI
- Multi-service orchestration with Docker Compose
- IaC generation patterns (Terraform, Kubernetes)
- Using custom agents (Planner → Implementer) for infrastructure design

#### Source Files Involved

- `copilot-agent-and-mcp/backend/` — Express.js app to containerize
- `copilot-agent-and-mcp/frontend/` — React app to containerize
- `book-database-mcp-server/` — TypeScript MCP server to containerize
- `copilot-agent-and-mcp/package.json` — build scripts and dependencies

---

### Lab 11: Multi-Agent Governance

> **File:** `11-multi-agent-governance.md`
> **Mode:** VS Code (Agent Mode)
> **Duration:** 45–60 min
> **Prerequisites:** Labs 01–04 (agents, hooks, skills, plugins)

#### Objective

Design and implement a multi-agent governance framework that enforces organizational policies during AI-assisted development. Build agents, hooks, and skills that work together to ensure code quality, security compliance, and architectural consistency.

#### Exercises

| # | Title | Description | Tools / Mode |
| --- | --- | --- | --- |
| 1 | **Build a Policy Enforcer agent** | Create a custom agent that validates code changes against organizational policies: no hardcoded secrets, proper error handling, consistent API response formats, required comment prefixes. The agent uses read-only tools and produces a compliance report. | VS Code Agent Mode |
| 2 | **Create a License Compliance hook** | Build a `PreToolUse` hook that checks any new `npm install` commands against an allowlist of approved licenses. Block installations of packages with GPL, AGPL, or unknown licenses. Log all dependency additions to an audit file. | VS Code Agent Mode + hooks |
| 3 | **Build a Change Impact Analyzer skill** | Create a skill that analyzes the blast radius of a code change: which routes are affected, which tests need to run, which API contracts might break. The skill reads the OpenAPI spec and test files to produce an impact matrix. | VS Code Agent Mode + skills |
| 4 | **Orchestrate a governance pipeline** | Wire all three together into a Feature Builder–style coordinator agent: (a) developer submits a change request, (b) Planner generates the plan, (c) Policy Enforcer validates the plan, (d) Implementer executes, (e) Change Impact Analyzer determines test scope, (f) Reviewer validates. Use handoffs between agents. | VS Code Agent Mode + multi-agent |

#### Key Learning Outcomes

- Designing governance policies as code (agents, hooks, skills)
- Building approval gates in AI-assisted workflows
- Multi-agent orchestration for compliance
- Audit trail generation with hooks

#### Source Files Involved

- `.github/agents/` — custom agents from Lab 01
- `.github/hooks/` — hooks from Lab 02
- `.github/skills/` — skills from Lab 03
- `copilot-agent-and-mcp/backend/openapi.yaml` — API contract for impact analysis

---

### Lab 12: SRE Agent

> **File:** `12-sre-agent.md`
> **Mode:** VS Code (Agent Mode)
> **Duration:** 45–60 min
> **Prerequisites:** Labs 01–02 (agents, hooks), Lab 10 (IaC)

#### Objective

Build an SRE (Site Reliability Engineering) agent that helps diagnose production issues, generate runbooks, create monitoring dashboards, and automate incident response for the Book Favorites app.

#### Exercises

| # | Title | Description | Tools / Mode |
| --- | --- | --- | --- |
| 1 | **Build an SRE Diagnostics agent** | Create a custom agent with access to terminal, search, and web fetch tools. The agent can: inspect logs, check process health, test API endpoints, analyze error patterns, and produce a structured incident report with root cause analysis and remediation steps. | VS Code Agent Mode |
| 2 | **Generate monitoring and alerting** | Use Agent Mode to generate: (a) a `/health` endpoint for the backend with dependency checks (file system, data integrity), (b) Prometheus metrics middleware for request latency, error rates, and throughput, (c) Grafana dashboard JSON for the book API. | VS Code Agent Mode |
| 3 | **Create runbooks** | Use Agent Mode to generate operational runbooks as Markdown files: (a) "Backend not responding" — check process, port, logs, restart steps, (b) "High error rate on /api/v1/books" — check data file integrity, validate JSON, test endpoints, (c) "E2E tests failing in CI" — check Cypress screenshots, verify backend health, reset test data. Link runbooks to specific health check failures. | VS Code Agent Mode |
| 4 | **Automate incident response with hooks** | Create a `Stop` hook that runs after an agent session and generates a session summary: what files were changed, what tests were run, what issues were found. Store the summary in a `session-logs/` directory for audit purposes. | VS Code Agent Mode + hooks |

#### Key Learning Outcomes

- Building SRE-focused AI agents for diagnostics
- Generating observability infrastructure (health checks, metrics, dashboards)
- Creating operational runbooks with AI assistance
- Automating incident documentation with hooks

#### Source Files Involved

- `copilot-agent-and-mcp/backend/server.js` — add health endpoint
- `copilot-agent-and-mcp/backend/routes/` — add metrics middleware
- `copilot-agent-and-mcp/.github/hooks/` — session summary hook

---

### Lab 13: Copilot Coding Agent on GitHub.com

> **File:** `13-copilot-coding-agent.md`
> **Mode:** GitHub.com (Copilot coding agent)
> **Duration:** 45–60 min
> **Prerequisites:** Labs 00, 05–06 (instructions, MCP server), working CI pipeline

#### Objective

Use the Copilot coding agent (`@copilot`) on GitHub.com to autonomously implement features, fix bugs, and process issues — all without opening VS Code. Learn how to write effective issues, configure `copilot-setup-steps.yml`, review coding agent PRs, and iterate with comments.

#### Exercises

| # | Title | Description | Mode |
| --- | --- | --- | --- |
| 1 | **Configure the coding agent environment** | Review and enhance `copilot-setup-steps.yml` to install all dependencies (root, frontend, MCP server), build the MCP server, copy test data, and verify the backend starts. Push the changes and verify the workflow runs successfully. | GitHub.com |
| 2 | **Feature implementation via issue** | Create a well-structured GitHub issue: "Add a `/api/v1/books/:id/reviews` endpoint that allows authenticated users to post reviews for books. Store reviews in `backend/data/reviews.json`. Include GET and POST methods, validation, and pagination." Assign `@copilot` to the issue. Review the generated PR: check code quality, test coverage, instruction compliance (`generated-by-copilot:` prefix). | GitHub.com |
| 3 | **Bug fix via issue** | Create an issue describing the `reading_list.cy.js` E2E test failure (registration returns 409 on repeat runs — see screenshots). Provide context about the random username generation and the test data lifecycle. Assign `@copilot` and review the fix PR. | GitHub.com |
| 4 | **Iterate on a coding agent PR** | On the PR from Exercise 2 or 3, leave review comments requesting changes: "Add rate limiting to the reviews endpoint", "Add a test for the case where the book ID doesn't exist". Observe how the coding agent processes review feedback and pushes additional commits. | GitHub.com |
| 5 | **Multi-issue workflow** | Create three linked issues: (a) "Add book search by author endpoint", (b) "Add frontend search component that uses the new endpoint", (c) "Add E2E test for book search". Assign `@copilot` to each in order. After each PR is merged, assign the next issue. Observe how the coding agent builds on merged code. | GitHub.com |

#### Key Learning Outcomes

- Writing effective issues for the Copilot coding agent
- Configuring `copilot-setup-steps.yml` for reliable environment setup
- Reviewing and iterating on coding agent PRs
- Multi-issue workflows with the coding agent
- Understanding coding agent limitations and when to intervene

#### Source Files Involved

- `copilot-agent-and-mcp/.github/workflows/copilot-setup-steps.yml` — agent environment
- `copilot-agent-and-mcp/.github/copilot-instructions.md` — instructions the agent follows
- `copilot-agent-and-mcp/backend/routes/` — existing route patterns for the agent to follow
- `copilot-agent-and-mcp/frontend/cypress/e2e/reading_list.cy.js` — failing test to fix

---

## Cross-Cutting Themes

Each lab reinforces these recurring themes:

| Theme | How It Appears |
| --- | --- |
| **Test as guardrail** | Every code change runs `npm run test:backend` and/or `npm run test:frontend` to verify correctness |
| **Custom instructions compliance** | Generated code must follow `copilot-instructions.md` (comment prefix, test commands, conventions) |
| **Agent pipeline** | Planner → Implementer → Reviewer pattern is reused across labs 07–12 |
| **MCP integration** | The book-database MCP server appears in test generation (fixtures), IaC (containerization), and SRE (monitoring) |
| **GitHub.com integration** | Labs 07, 09, and 13 include exercises using the Copilot coding agent on GitHub.com |
| **Progressive complexity** | Labs start with VS Code Agent Mode, add custom agents, then move to GitHub.com |

---

## Lab Dependencies

```
Lab 00 (Instructions) ──────┬──► Lab 07 (Test Generation)
Lab 01 (Agents) ─────────┬──┤
Lab 02 (Hooks) ──────────┤  ├──► Lab 08 (Code Modernization)
Lab 03 (Skills) ──────────┤  │
Lab 04 (Plugins) ─────────┘  ├──► Lab 09 (CI/CD Generation)
                              │
Lab 05 (MCP Builder) ────────┼──► Lab 10 (Infrastructure as Code)
Lab 06 (MCP Data) ───────────┤
                              ├──► Lab 11 (Multi-Agent Governance)
                              │
                              ├──► Lab 12 (SRE Agent)
                              │
                              └──► Lab 13 (Copilot Coding Agent)
```

### Minimum Path

For workshops with limited time, the minimum viable path is:

1. **Lab 00** (Custom Instructions) — 45 min
2. **Lab 01** (Custom Agents) — 65 min
3. **Lab 05** (MCP Builder) — 50 min
4. **Lab 07** (Test Generation) — 50 min
5. **Lab 13** (Copilot Coding Agent) — 50 min

**Total minimum:** ~4.5 hours

### Full Path

All 14 labs in sequence: **~10–12 hours** (suitable for a 2-day workshop).

---

## Development Priorities

| Priority | Lab | Rationale |
| --- | --- | --- |
| **P0 — Must Have** | Lab 07 (Test Generation) | Most requested DevOps use case; directly addresses the failing E2E tests seen in screenshots |
| **P0 — Must Have** | Lab 13 (Copilot Coding Agent) | Key differentiator — coding agent on GitHub.com is the newest and most impactful capability |
| **P0 — Must Have** | Lab 09 (CI/CD Generation) | Core DevOps workflow; builds on existing `ci.yml` and `copilot-setup-steps.yml` |
| **P1 — Should Have** | Lab 08 (Code Modernization) | Demonstrates practical refactoring patterns; uses agent pipeline |
| **P1 — Should Have** | Lab 10 (Infrastructure as Code) | Covers containerization and IaC — standard DevOps needs |
| **P2 — Nice to Have** | Lab 11 (Multi-Agent Governance) | Advanced multi-agent patterns; enterprise governance |
| **P2 — Nice to Have** | Lab 12 (SRE Agent) | Specialized SRE workflows; requires some IaC context |

---

## Conventions for Lab Development

All new labs should follow these conventions (consistent with Labs 00–06):

1. **File naming:** `NN-topic-name.md` (e.g., `07-test-generation.md`)
2. **Structure:** Overview → Prerequisites table → Exercises (numbered) → Steps within exercises → Validation checklist → Key Learning Outcomes
3. **Exercise format:** Each exercise has a clear objective, a Copilot prompt (in code block), expected output criteria (table), and a verification step
4. **Comment prefix:** All generated code must use `generated-by-copilot:` prefix per `copilot-instructions.md`
5. **Test verification:** Every exercise that modifies code includes a step to run `npm run test:backend` or `npm run test:frontend`
6. **Duration:** Each lab targets 45–60 minutes
7. **Diagrams:** Use ASCII diagrams (not Mermaid) for consistency with existing labs
8. **Tips and warnings:** Use `> **Tip:**` and `> [!NOTE]` callout styles

---

## Next Steps

1. Develop **Lab 07 (Test Generation)** — P0, addresses the failing `reading_list.cy.js` tests shown in screenshots
2. Develop **Lab 13 (Copilot Coding Agent)** — P0, covers GitHub.com workflows
3. Develop **Lab 09 (CI/CD Generation)** — P0, evolves existing CI pipeline
4. Review and iterate on lab content with pilot testers
5. Develop P1 labs (08, 10) and P2 labs (11, 12) in subsequent sprints
