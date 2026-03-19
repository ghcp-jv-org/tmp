# Lab: Azure Skills Plugin - Deploy the Book Favorites App to Azure

> \[!NOTE\]
> This lab uses the **Azure Skills Plugin** ([github.com/microsoft/azure-skills](https://github.com/microsoft/azure-skills)) to take the **Book Favorites** app (`copilot-agent-and-mcp/`) from localhost to Azure - using AI agent expertise instead of manual cloud guesswork.

## Overview

The **Book Favorites** app is a full-stack application you've been working with throughout this workshop:

| Component | Tech | Details |
| --- | --- | --- |
| **Backend** | Express.js 5 on Node 20 | REST API on port 4000 - `/api/register`, `/api/login`, `/api/books`, `/api/favorites` |
| **Frontend** | React 19 + Vite | SPA with Redux Toolkit, served on port 5173, proxied to the backend |
| **Auth** | JWT | `jsonwebtoken` with a hardcoded secret (`your_jwt_secret`) |
| **Data** | JSON files | `backend/data/books.json` and `users.json` - flat file storage |
| **Tests** | Jest (backend) + Cypress (E2E) | 16 backend tests, 3 E2E tests - all passing |

Right now this app runs on `localhost`. The **Azure Skills Plugin** will give your AI coding agent the expertise and execution tools to get it running on Azure - with proper infrastructure, security, and operational visibility.

### What You Will Learn

* How to install the Azure Skills Plugin and verify its three layers against the Book Favorites app
* How the agent analyzes *this specific app's* architecture (Express + React + JWT + JSON files) and recommends Azure services
* How to generate infrastructure code (Bicep, `azure.yaml`) tailored to a split backend/frontend Node.js app
* How to identify security issues in the app (hardcoded JWT secret, plaintext passwords) before deploying to production
* How to set up monitoring, cost guardrails, and RBAC for the deployed app

### Prerequisites

| Requirement | Details |
| --- | --- |
| **Azure Account** | Active Azure subscription |
| **Node.js** | v18 or later (`npx` must work on your PATH) |
| **Azure CLI** | Installed and authenticated (`az login`) |
| **Azure Developer CLI** | Installed and authenticated (`azd auth login`) |
| **VS Code** | With GitHub Copilot extension (Agent Mode enabled) |
| **App running locally** | `npm install && npm start` in `copilot-agent-and-mcp/` - backend on :4000, frontend on :5173 |
| **Tests passing** | `npm run test:backend` (16 tests) and `npm run build:frontend && npm run test:frontend` (3 E2E tests) |

### Time Estimate

60 - 90 minutes

---

## Part 1 - Install the Azure Skills Plugin (10 min)

### Step 1 - Install via VS Code

Install the **Azure MCP extension** from the Visual Studio Marketplace:

👉 [Azure MCP Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server)

The extension installs a companion that brings Azure skills into VS Code. Together they configure the Azure MCP Server, Foundry MCP, and the full skills layer automatically.

> **Note:** The skills extension requires **Git CLI**. If missing, ask Copilot: _"Help me install Git for Windows."_

### Step 2 - Verify Authentication

Open a terminal and confirm:

```powershell
az login
az account show -query "{name:name, id:id}" -o table
azd auth login
```

You should see your subscription name and ID. If `azd` is not installed:

```powershell
winget install Microsoft.Azd
```

### Step 3 - Verify the Plugin Structure

After installation, confirm these files exist in your workspace:

```
.github/plugins/azure-skills/
├── skills/                    # 20 Azure skill definitions
│   ├── azure-prepare/         # Analyzes project → generates infra code
│   ├── azure-validate/        # Pre-flight checks before deployment
│   ├── azure-deploy/          # Orchestrates azd deployment pipeline
│   ├── azure-diagnostics/     # Troubleshoots live failures with logs/KQL
│   ├── azure-cost-optimization/
│   └── ...                    # 15 more skills
├── .mcp.json                  # MCP server configuration
└── plugin.json                # Plugin metadata
```

---

## Part 2 - Verify the Three Layers Against the Book Favorites App (15 min)

The plugin installs three capability layers. Verify each one by asking questions specific to the Book Favorites app.

### Exercise 2.1 - Verify Skills: Analyze the Book Favorites Architecture

The skills layer teaches the agent how to reason about Azure services. Test it by pointing the agent at the actual app.

In Copilot Chat (Agent Mode), ask:

> "Analyze the `copilot-agent-and-mcp/` folder. It has an Express.js backend on port 4000 serving REST APIs (`/api/books`, `/api/favorites`, `/api/login`, `/api/register`) with JWT auth and JSON file storage, plus a React/Vite frontend. What Azure services should I use to deploy this app? Consider that the backend uses `fs.readFileSync`/`fs.writeFileSync` for data persistence."

**What to look for in the response:**

| Expected Recommendation | Why |
| --- | --- |
| **Azure App Service** or **Azure Container Apps** for the backend | Express.js needs a compute layer with Node.js runtime |
| **Azure Static Web Apps** or **Azure Storage static website** for the frontend | React/Vite builds to static files (`dist/`) |
| **Azure Database for PostgreSQL** or **Azure Cosmos DB** replacing JSON files | `fs.readFileSync`/`fs.writeFileSync` won't work with horizontal scaling |
| **Azure Key Vault** for the JWT secret | The hardcoded `'your_jwt_secret'` in `server.js` is a security risk |
| **Azure Front Door** or **API Management** | To route frontend requests to the backend API |

**Red flag:** If the agent gives a generic "use App Service" answer without mentioning the JSON file storage problem or the hardcoded JWT secret, the skills layer may not be loaded. Check that `.github/plugins/azure-skills/skills/` exists.

### Exercise 2.2 - Verify Azure MCP: Query Real Azure Resources

The Azure MCP Server gives the agent hands to act on your Azure account. Test it with a real query.

In Copilot Chat, ask:

> "List my Azure resource groups. Then check if there is an existing App Service Plan I could reuse for the Book Favorites backend."

**Expected behavior:**
1. The agent invokes `azure_resources-query_azure_resource_graph` or similar MCP tool
2. You see a tool approval prompt - **review and approve it**
3. Real resource groups from your subscription are returned
4. The agent checks for existing App Service Plans

**If this fails:**
* Re-run `az login`
* Run `az account set -subscription <YOUR_SUB_ID>` to select the right subscription
* Restart VS Code to re-index MCP configuration

### Exercise 2.3 - Verify Foundry MCP: Check Available AI Models

In Copilot Chat, ask:

> "I want to add a book recommendation feature to the Book Favorites app using an AI model. What models are available in Microsoft Foundry that could generate book recommendations based on a user's favorites list?"

**Expected behavior:** The agent should invoke Foundry MCP tools and return model catalog data - not just a generic answer about OpenAI models.

> **Note:** If you don't have a Foundry project, you'll see a setup error. That's fine - the point is verifying the tool is being invoked.

### Exercise 2.4 - Record Your Results

| Layer | Prompt | What Happened | Tools Invoked | Pass/Fail |
| --- | --- | --- | --- | --- |
| Skills | "Analyze copilot-agent-and-mcp..." | (record) | (none - skills are prompt-based) | ☐ |
| Azure MCP | "List my resource groups..." | (record) | (list tool names you saw) | ☐ |
| Foundry MCP | "What models for recommendations..." | (record) | (list tool names) | ☐ |

---

## Part 3 - Prepare, Validate, and Deploy the Book Favorites App (25 min)

This is the core workflow. You'll take the Book Favorites app from `localhost:4000` / `localhost:5173` to a real Azure deployment.

### Exercise 3.1 - Prepare: Generate Infrastructure Code (azure-prepare)

In Copilot Chat (Agent Mode), use this prompt:

> "Prepare the `copilot-agent-and-mcp/` app for Azure deployment. The app has:
> - An Express.js 5 backend (port 4000) with JWT auth and JSON file storage
> - A React 19 / Vite frontend that builds to `frontend/dist/`
> - Backend routes: `/api/register`, `/api/login`, `/api/books`, `/api/favorites`
> - Dependencies: `express`, `cors`, `body-parser`, `jsonwebtoken`, `fs`
> - Tests: Jest backend tests (`npm run test:backend`) and Cypress E2E (`npm run build:frontend && npm run test:frontend`)
>
> Generate an `azure.yaml` manifest and Bicep infrastructure files. Use Azure Container Apps for the backend and Azure Static Web Apps for the frontend. Make sure to handle the JSON file storage problem - the backend reads/writes `books.json` and `users.json` via `fs.readFileSync`."

**Review the generated files and check:**

1. **`azure.yaml`** - Does it define two services (`backend` and `frontend`)?
2. **Bicep files** - Do they create a Container App for the backend with proper environment variables?
3. **Data storage** - Did the agent flag that `fs.readFileSync`/`fs.writeFileSync` won't work with Container Apps (no persistent local filesystem)? Did it suggest Azure Blob Storage or a database?
4. **JWT secret** - Did the agent move `'your_jwt_secret'` out of `server.js` into Key Vault or environment variables?
5. **CORS** - Did the agent configure CORS to allow the Static Web App URL instead of the current `cors()` wildcard?

### Exercise 3.2 - Validate: Pre-Flight Checks (azure-validate)

Before deploying, run pre-flight validation:

> "Validate the Azure deployment files you just generated for the Book Favorites app. Specifically check:
> 1. Are the resource names valid (length, allowed characters)?
> 2. Is the Container App configured with the right port (4000)?
> 3. Is the frontend build output path correct (`frontend/dist/`)?
> 4. Are there any missing environment variables the backend needs?
> 5. Is the JWT secret handled securely (not hardcoded in Bicep)?"

**Expected findings the agent should flag:**

| # | Issue | Severity |
| --- | --- | --- |
| 1 | `SECRET_KEY = 'your_jwt_secret'` is hardcoded in `server.js` | **Critical** - must use Key Vault or env var |
| 2 | Passwords stored in plaintext in `users.json` | **High** - `auth.js` stores raw passwords |
| 3 | No health check endpoint for Container Apps | **Medium** - Container Apps needs a `/health` route |
| 4 | `fs.readFileSync`/`fs.writeFileSync` won't persist in Container Apps | **High** - data lost on restart |
| 5 | CORS is fully open (`app.use(cors())`) | **Medium** - should restrict to frontend URL |

### Exercise 3.3 - Fix Critical Issues Before Deployment

Based on the validation findings, ask the agent to fix the critical issues:

> "Fix the security issues in the Book Favorites backend before deploying:
> 1. Move the JWT secret to an environment variable `JWT_SECRET` with a fallback for local dev
> 2. Add a `/api/health` endpoint that returns `{ status: 'ok' }` for Container Apps health probes
> 3. Update CORS to accept a configurable origin via `CORS_ORIGIN` environment variable
>
> Keep the existing tests passing - run `npm run test:backend` after changes."

### Exercise 3.4 - Deploy (azure-deploy)

> \[!CAUTION\]
> This creates real Azure resources that incur costs. Delete them after the exercise.

In Copilot Chat, ask:

> "Deploy the Book Favorites app to Azure using `azd up`. Use the infrastructure files we generated. Set the JWT_SECRET and CORS_ORIGIN environment variables during deployment."

**Or for a dry run (no cost):**

> "Show me the exact sequence of `azd` commands to deploy the Book Favorites app, without running them. Include the environment variable configuration for JWT_SECRET and CORS_ORIGIN."

**Expected `azd` sequence:**

```bash
azd init                              # Initialize the project
azd env set JWT_SECRET <strong-secret>  # Set the JWT secret
azd env set CORS_ORIGIN https://<frontend-url>  # Set the allowed CORS origin
azd up                                # Provision infrastructure + deploy code
```

### Exercise 3.5 - Verify the Deployment

After deployment (or as a discussion for dry runs), verify:

1. **Backend health check:** `curl https://<backend-url>/api/health` returns `{ "status": "ok" }`
2. **Frontend loads:** Browse to the Static Web App URL - the React app should render
3. **API connectivity:** Register a user, login, view books, add to favorites
4. **Data persistence:** After adding a favorite, restart the Container App - is the data still there? (If using JSON files: no. This proves why a database migration is needed.)

---

## Part 4 - Operate the Deployed Book Favorites App (15 min)

Now that the app is deployed (or conceptually deployed), use the plugin's operational skills.

### Exercise 4.1 - Cost Analysis for the Book Favorites Stack

In Copilot Chat, ask:

> "Estimate the monthly cost of running the Book Favorites app on Azure with this stack:
> - 1 Azure Container App (0.5 vCPU, 1 GB RAM) running the Express.js backend
> - 1 Azure Static Web App (Free tier) for the React frontend
> - 1 Azure Database for PostgreSQL Flexible Server (Burstable B1ms) if we migrate from JSON files
> - 1 Azure Key Vault (Standard tier) for the JWT secret
>
> Then check my actual Azure subscription for any resources I could optimize or delete."

**Expected behavior:** The agent should:
1. Provide estimated costs per resource per month
2. Use Azure MCP tools to query your real subscription
3. Flag any idle or oversized resources

### Exercise 4.2 - Set Up Monitoring for the Backend

In Copilot Chat, ask:

> "Set up Application Insights monitoring for the Book Favorites backend. I want to track:
> - Request latency on `/api/books` and `/api/favorites`
> - Failed login attempts on `/api/login` (401 responses)
> - Error rates on all endpoints
>
> Show me the KQL queries I'd use to create a dashboard for these metrics."

**Expected output:** The agent should provide specific KQL queries like:

```kusto
// generated-by-copilot: failed login attempts in the last 24h
requests
| where url endswith "/api/login" and resultCode == "401"
| summarize FailedLogins = count() by bin(timestamp, 1h)
| render timechart
```

### Exercise 4.3 - Diagnose a Simulated Failure

In Copilot Chat, ask:

> "The Book Favorites backend Container App is returning 500 errors on `/api/favorites`. The logs show `ENOENT: no such file or directory, open '/app/backend/data/users.json'`. Diagnose this issue and explain the root cause and fix."

**Expected diagnosis:** The agent should identify that:
1. Container Apps don't persist local files across restarts
2. The `users.json` file doesn't exist in the container's filesystem
3. The fix is either mounting Azure Files or migrating to a database
4. Provide the specific `az containerapp` commands to mount a volume

### Exercise 4.4 - RBAC for Team Access

In Copilot Chat, ask:

> "I need to give a junior developer read-only access to the Book Favorites Azure resources (Container App, Static Web App, Key Vault) without letting them see the JWT secret value. What's the minimal set of roles? Show me the `az role assignment create` commands."

**Expected answer:** The agent should recommend:
* `Reader` on the resource group (view resources)
* `Key Vault Secrets Officer` or `Key Vault Reader` - but NOT `Key Vault Secrets User` (which would let them read the secret value)

---

## Part 5 - Security Hardening Before Production (10 min)

The Book Favorites app has several security issues that the Azure Skills Plugin should catch and help fix before production.

### Exercise 5.1 - Security Audit of the Book Favorites App

In Copilot Chat, ask:

> "Run a security audit of the Book Favorites app in `copilot-agent-and-mcp/` before deploying to production on Azure. Check for OWASP Top 10 issues, Azure-specific security concerns, and compliance with Azure security best practices."

**Issues the agent should find:**

| # | File | Issue | OWASP Category |
| --- | --- | --- | --- |
| 1 | `server.js` | `SECRET_KEY = 'your_jwt_secret'` hardcoded | A02:2021 - Cryptographic Failures |
| 2 | `auth.js` | Passwords stored in plaintext (`users.json`) | A02:2021 - Cryptographic Failures |
| 3 | `auth.js` | No rate limiting on `/api/login` | A07:2021 - Identification and Auth Failures |
| 4 | `server.js` | CORS wildcard (`app.use(cors())`) | A05:2021 - Security Misconfiguration |
| 5 | `books.js` | No input validation on request parameters | A03:2021 - Injection |
| 6 | `favorites.js` | `bookId` uses loose equality (`==` vs `===`) | Logic bug |

### Exercise 5.2 - Generate Azure-Specific Security Fixes

In Copilot Chat, ask:

> "For the Book Favorites app deployment to Azure Container Apps, generate the security configuration:
> 1. Bicep for a Key Vault to store the JWT secret
> 2. Managed Identity for the Container App to access Key Vault
> 3. Network Security Group rules to restrict backend access to only the Static Web App
> 4. Container App ingress configuration to enable HTTPS only"

### Exercise 5.3 - CI/CD Security Integration

Review the existing `.github/workflows/ci.yml` which runs tests on push. Ask:

> "Update the Book Favorites CI/CD pipeline (`.github/workflows/ci.yml`) to add Azure deployment. Include:
> 1. `azd provision` and `azd deploy` steps after tests pass
> 2. Service principal authentication using GitHub secrets
> 3. A validation step that runs `azure-validate` checks before deployment
> 4. Keep the existing test steps (`npm run test:backend` and E2E tests) as gates"

---

## Part 6 - Data Migration Planning (10 min)

The Book Favorites app uses `fs.readFileSync`/`fs.writeFileSync` with local JSON files. This won't survive in Azure Container Apps. Use the plugin to plan the migration.

### Exercise 6.1 - Assess the Current Data Layer

In Copilot Chat, ask:

> "Analyze the data access patterns in the Book Favorites backend (`copilot-agent-and-mcp/backend/`). The app uses `readJSON()` and `writeJSON()` helper functions in `server.js` that call `fs.readFileSync` and `fs.writeFileSync`. The data files are:
> - `books.json`: 10 books with `id`, `title`, `author` - read-only in production
> - `users.json`: user accounts with `username`, `password`, `favorites[]` - read/write
>
> Recommend an Azure data service and generate a migration plan. Consider cost, complexity, and the app's current scale."

**Expected recommendations the agent should compare:**

| Option | Service | Pros | Cons |
| --- | --- | --- | --- |
| 1 | **Azure Cosmos DB (NoSQL)** | Schema-flexible, serverless tier, global distribution | Overkill for 10 books and a few users |
| 2 | **Azure Database for PostgreSQL** | Relational, Burstable B1ms is cheap, Entra ID auth | Requires schema design and ORM |
| 3 | **Azure Blob Storage** | Drop-in replacement for JSON files, very cheap | No query capability, race conditions on writes |
| 4 | **Azure Table Storage** | Simple key-value, very cheap, no schema | Limited query flexibility |

### Exercise 6.2 - Generate the Migration Code

Pick the recommended option and ask:

> "Generate the migration code to move the Book Favorites backend from JSON file storage to [chosen service]. Update `server.js`, `routes/auth.js`, `routes/books.js`, and `routes/favorites.js`. Keep the existing API contracts identical so the frontend and tests don't break."

---

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Agent gives generic advice, doesn't mention JSON file issue | Skills layer not loaded - check `.github/plugins/azure-skills/skills/` exists; reload VS Code |
| MCP tools not showing up | Verify Node.js is installed and `npx` works; check `.mcp.json`; restart MCP servers |
| `az login` errors | Re-run `az login`; run `az account set -s <sub-id>`; check VPN/proxy |
| `azd up` fails | Run `azd env list` to check environment; run `azd down` to clean up partial deployments |
| Backend tests fail after changes | Run `npm run test:backend` from `copilot-agent-and-mcp/`; check that `TEST_MODE` env var is set |
| E2E tests fail after changes | Run `npm run build:frontend && npm run test:frontend`; ensure backend is on :4000 and frontend on :5173 |
| Foundry MCP not responding | Need a Foundry project configured; check Foundry MCP in `.mcp.json` |

---

## Summary

| Part | What You Did | Key Skill Used |
| --- | --- | --- |
| Part 1 | Installed plugin, verified auth | Installation |
| Part 2 | Verified 3 layers against the Book Favorites app architecture | `azure-prepare`, Azure MCP, Foundry MCP |
| Part 3 | Generated infra code, validated, deployed the app | `azure-prepare`, `azure-validate`, `azure-deploy` |
| Part 4 | Set up monitoring, diagnosed failures, configured RBAC | `azure-diagnostics`, `azure-observability`, `azure-rbac` |
| Part 5 | Security audit, hardened the app for production | `azure-compliance`, `azure-rbac` |
| Part 6 | Planned data migration from JSON files to Azure DB | `azure-storage`, `azure-prepare` |

### Key Takeaways

* **The plugin analyzed the actual Book Favorites architecture** (Express + React + JWT + JSON files) and gave specific Azure recommendations - not generic cloud advice.
* **The JSON file storage problem** (`fs.readFileSync`/`fs.writeFileSync`) is the #1 blocker for cloud deployment. The skills layer caught this and proposed concrete alternatives.
* **Security issues surfaced before deployment** - hardcoded JWT secret, plaintext passwords, open CORS - instead of after a production incident.
* **Prepare → Validate → Deploy** is a real workflow: the validate step caught the missing health endpoint and the CORS misconfiguration before `azd up` wasted time and money.
* **Operational skills** (diagnostics, cost optimization, RBAC) apply to the deployed app - not just to deployment itself.
* **The agent acts with your credentials** - explicit tool approvals and least-privilege RBAC are non-negotiable in production.

### Additional Resources

* [Azure Skills Plugin - GitHub](https://github.com/microsoft/azure-skills)
* [Azure MCP Server Documentation](https://learn.microsoft.com/azure/developer/azure-mcp-server/)
* [Foundry MCP - Getting Started](https://learn.microsoft.com/en-us/azure/foundry/mcp/get-started?tabs=user)
* [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
* [Announcing the Azure Skills Plugin (Microsoft Blog)](https://devblogs.microsoft.com/all-things-azure/announcing-the-azure-skills-plugin/)
* [Visual Studio Magazine Article](https://visualstudiomagazine.com/articles/2026/03/13/microsoft-launches-azure-skills-plugin-to-give-ai-coding-agents-real-azure-expertise.aspx)
