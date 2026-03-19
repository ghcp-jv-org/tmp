# Lab 11 - Azure SRE Agent: Closed-Loop Incident Triage

> **Mode:** Azure + GitHub.com  
> **Duration:** 60 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md), Azure subscription, deployed application  
> **Note:** This is the capstone lab. If Azure access is unavailable, exercises can be completed as walkthroughs using simulated scenarios.

---

## Objective

Close the Agentic DevOps loop: production alert → incident investigation → automated triage → code fix PR. This demonstrates the end-to-end flow from operations back to development.

| Exercise | Skill | What You Learn |
|-----|----|--------|
| 1 | **Alert-to-issue pipeline** | Set up (or simulate) a production alert that creates a GitHub issue - the trigger that starts the loop |
| 2 | **AI-assisted investigation** | Use Agent Mode to analyze the incident, identify root cause, and produce an investigation summary - the agent reads code and logs like an SRE |
| 3 | **Automated fix delegation** | Create a fix issue from the investigation and assign it to the Coding Agent - the agent generates a patch PR from root cause analysis |
| 4 | **Closed-loop verification** | Trace the full flow from alert to merged fix - identify human control points and assess automation boundaries |

```
Azure Monitor Alert → GitHub Issue → SRE Agent Investigates → Copilot Coding Agent → Fix PR → Human Merges
```

---

## Exercise 1: Alert-to-Issue Pipeline - Set Up Production Monitoring

> **Purpose:** Create the trigger that starts the incident loop. Either configure Azure Monitor to create GitHub issues on alerts, or simulate a production incident by creating a detailed issue manually. This is step 1 of the closed loop - production tells development something is wrong.

### Step 1: Deploy the Application (if not done)

If you completed Lab 09, you have IaC templates. Deploy using the Bicep template:

```bash
az deployment group create \
  -resource-group <YOUR-RG> \
  -template-file infra/main.bicep \
  -parameters infra/main.parameters.json
```

If you don't have a deployed app, use the simulation approach in Step 1b.

### Step 1b: Simulate a Production Alert (No Azure Required)

Create a GitHub Issue manually that represents a production incident:

```
Title: [ALERT] High error rate on /api/books endpoint

Description:
**Alert Source:** Azure Monitor (simulated)
**Severity:** Critical
**Time:** 2026-03-13T10:30:00Z
**Metric:** HTTP 500 error rate > 5% on /api/books for 10 minutes

**Diagnostic Data:**
- Error message: "Cannot read properties of undefined (reading 'map')"
- Stack trace points to routes/books.js line 42
- Triggered after recent deployment (commit abc1234)
- Affected users: ~200 requests/min returning 500

**Impact:** Users cannot browse the book catalog
```

Skip to Exercise 2.

### Step 2: Configure Azure Monitor Alert (Azure Required)

1. In Azure Portal, navigate to your App Service
2. Go to **Monitoring** → **Alerts** → **Create alert rule**
3. Configure:
   - **Condition:** HTTP 5xx errors > 5 in 5 minutes
   - **Action group:** Create a new action group with a GitHub webhook
4. Link the action to create a GitHub Issue automatically

### Step 3: Trigger the Alert

Introduce a temporary bug to cause 500 errors:

In `backend/routes/books.js`, add before the response:

```javascript
// generated-by-copilot: temporary bug for lab exercise
if (Math.random() < 0.5) throw new Error("Simulated failure");
```

Deploy and wait for the alert to fire.

### Validation

- [ ] Alert configured (or simulated issue created)
- [ ] GitHub Issue created from alert (automated or manual)
- [ ] Issue contains diagnostic information

---

## Exercise 2: AI-Assisted Investigation - Root Cause Analysis

> **Purpose:** Use Agent Mode as an SRE. Point it at the incident details and the codebase, and ask it to investigate: what code could cause this error, under what conditions, and what’s the fix? The agent reads code like an on-call engineer - but faster.

### Step 1: Analyze the Incident with Agent Mode

Open the issue in your repo. Then in VS Code Agent Mode:

```
#codebase

A production alert has been triggered. Review this incident:
- High HTTP 500 error rate on /api/books
- Error: "Cannot read properties of undefined (reading 'map')"
- Stack trace points to routes/books.js

Investigate:
1. What code in routes/books.js could cause this error?
2. What conditions would trigger it?
3. Was there a recent change that could have introduced this?
4. What is the recommended fix?

Provide a root cause analysis summary.
```

### Step 2: Review the Analysis

Copilot should identify:
- The specific line/code block causing the issue
- The condition (undefined data being mapped)
- Possible causes (missing data, failed JSON read, etc.)
- A recommended fix

### Validation

- [ ] Root cause identified
- [ ] Conditions for the error explained
- [ ] Fix recommended

---

## Exercise 3: Automated Fix Delegation - Coding Agent Patch PR

> **Purpose:** Take the root cause from Exercise 2, write it into a new GitHub issue, and assign it to the Coding Agent. The agent generates a targeted fix PR. This is the handoff from investigation to remediation - closing the loop from “what’s wrong” to “here’s the fix.”

### Step 1: Create a Fix Issue

On GitHub.com, create an issue from the incident findings:

```
Title: Fix: Add null safety to /api/books endpoint

Description:
**Root Cause:** The /api/books endpoint crashes with "Cannot read properties of
undefined (reading 'map')" when the books data file fails to load or returns undefined.

**Required Fix:**
1. Add null/undefined checks before iterating over book data in routes/books.js
2. Return an empty array with a 200 status if no books are available
3. Add proper error handling with a 500 response and error message if the data read fails
4. Add a unit test that covers the "no data" scenario
5. Remove any test/debug code that may have been left in the file

**Linked Alert:** #<issue-number-of-alert>
```

### Step 2: Assign to Copilot

1. Assign the issue to **Copilot**
2. Wait for 👀 reaction
3. Monitor in **Actions** tab

### Step 3: Review the Fix PR

When the PR is created, verify:

| Check | Expected |
|----|-----|
| Null safety | `if (!books)` or similar guard before `.map()` |
| Error handling | `try/catch` around data read with 500 response |
| Empty state | Returns `[]` when no books available |
| Test | Unit test covers the null data scenario |
| Debug code removed | Any `throw new Error("Simulated")` removed |
| PR links to alert issue | References the original alert issue |

### Step 4: Merge and Verify

1. Approve and merge the PR
2. If deployed: verify the endpoint returns 200 (empty or with data)
3. If local: pull and test

```bash
git pull
npm run test:backend
npm start
# Test the endpoint:
curl http://localhost:4000/api/books
```

**Expected:** 200 response with books array (or empty array).

### Validation

- [ ] Fix issue created and linked to alert
- [ ] Copilot generated a working fix PR
- [ ] Null safety and error handling added
- [ ] Unit test covers the failure scenario
- [ ] Endpoint returns 200 after fix

---

## Exercise 4: Closed-Loop Verification - Trace the Full Flow

> **Purpose:** Step back and trace the entire path: alert → issue → investigation → fix issue → agent PR → human merge. Identify where humans are in the loop and where automation handles things. This teaches the Agentic DevOps mental model - the connected pipeline from production back to code.

### Step 1: Trace the Full Flow

Document the complete path:

```
1. Production Alert (Azure Monitor or simulated)
        ↓
2. GitHub Issue created (automated or manual)
        ↓
3. Investigation (Agent Mode analysis)
        ↓
4. Fix Issue created (with root cause)
        ↓
5. Coding Agent generates PR
        ↓
6. Human reviews and merges
        ↓
7. Deploy → Alert resolves
```

### Step 2: Reflect

Consider:
- How much of this loop was automated vs. manual?
- Where are the human decision points? (Review, merge)
- What would full automation look like? What are the risks?

### Validation

- [ ] Full flow traced from alert to fix
- [ ] Human control points identified
- [ ] Closed loop demonstrated end-to-end

---

## Summary: The Agentic DevOps Flow

```
┌──────────────────────────────────────────────────────┐
│                  DEVELOPMENT                         │
│  Lab 01: Agent Mode     Lab 02: Coding Agent        │
│  Lab 06: Testing         Lab 07: Modernization       │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│                  DELIVERY                            │
│  Lab 08: CI/CD Pipelines   Lab 09: Infrastructure    │
│  Lab 10: Governance                                  │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│                  OPERATIONS                          │
│  Lab 11: SRE Agent → Alert → Issue → Fix → Merge    │
│          (loops back to Development)                 │
└──────────────────────────────────────────────────────┘
```

---

## Troubleshooting

| Issue | Fix |
|----|---|
| No Azure access | Use the simulated alert approach (Exercise 1, Step 1b) |
| Alert doesn't fire | Lower the threshold or manually trigger errors |
| Agent fix doesn't compile | Add a PR comment describing the error |
| Endpoint still fails after fix | Check if debug code was fully removed |
