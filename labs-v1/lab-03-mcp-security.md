# Lab 03 - Security Remediation

> **Mode:** GitHub.com + VS Code  
> **Duration:** 60 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md), GitHub Advanced Security enabled

---

## Objective

Use AI agents to detect, investigate, and fix security vulnerabilities in your codebase. Each exercise uses a different detection source and remediation approach.

| Exercise | Skill | What You Learn |
| --- | --- | --- |
| 1 | **Alert-driven remediation** | Coding Agent reads a CodeQL alert URL from the issue body and generates a targeted fix PR - automated triage from scanner to patch (no MCP needed) |
| 2 | **Proactive secret scanning** | Agent Mode scans for hardcoded secrets you already know exist - learn the externalization pattern (code → env vars → .env) |
| 3 | **Broad vulnerability audit** | Agent Mode acts as a security reviewer - surfaces OWASP-style issues across the codebase that no scanner flagged |

---

## Exercise 1: Alert-Driven Remediation - CodeQL Fix via Coding Agent

> **Purpose:** A scanner (CodeQL) found a vulnerability. Instead of investigating manually, you create an issue with the alert link in the body and let the Coding Agent follow the URL, understand the root cause, and generate a fix PR. The agent reads the alert natively via the GitHub API. This is the automated triage pattern: scanner → issue → agent → PR.

### Step 1: Enable GitHub Advanced Security

1.  Go to your repository → **Settings** → **Code security and analysis**
2.  Enable **GitHub Advanced Security**
3.  Under **Code scanning**, click **Set up** → **CodeQL analysis**
4.  Choose **Default**, click **Edit**, select **Extended** query suite
5.  Click **Enable CodeQL**

**Expected wait:** 5-10 minutes for first analysis.

### Step 2: Check Security Alerts

1.  Navigate to **Security** tab → **Code scanning alerts**
2.  Note the alert title and link
3.  If no vulnerability found yet, wait for CodeQL to complete

### Step 3: Create an Issue Referencing the Alert

In **Copilot Chat** on your repository page:

```
Create an issue to fix the security alert:
- Title: Fix alert <ALERT-TITLE>
- Body: Fix <LINK-TO-ALERT>
```

Replace `<ALERT-TITLE>` and `<LINK-TO-ALERT>` with values from Step 3.

### Step 4: Monitor the Agent

1.  Verify 👀 reaction on the issue
2.  Open **Actions** tab → find the triggered workflow
3.  In the PR timeline, observe the agent reading the alert URL and planning the fix

**Expected wait:** ~10 minutes.

### Step 5: Review the Security Fix

1.  Open the PR
2.  Check:
    *   PR body references the specific CodeQL alert
    *   Code changes address the vulnerability
    *   No new security issues introduced
3.  Scroll the PR timeline - note how the agent referenced the CodeQL alert

### Step 6: Iterate if Needed

If the fix is incomplete, comment on the PR:

```
The fix doesn't handle the edge case where input is null. Please add null checking.
```

**Expected:** Copilot reads the comment, updates the code, pushes a new commit.

### Validation

*   CodeQL enabled and alert detected
*   Issue created with alert link in the body
*   Agent followed the alert URL and understood the vulnerability
*   PR contains a valid security fix
*   Iteration via PR comment works

---

## Exercise 2: Proactive Secret Scanning - Hardcoded Secrets Remediation

> **Purpose:** No scanner needed - you already know the codebase has a hardcoded JWT secret (`SECRET_KEY = 'your_jwt_secret'` in `server.js`). Use Agent Mode to find it, externalize it to environment variables, and set up the `.env` pattern. This teaches the secret-to-env-var remediation workflow that applies to any project.

### Step 1: Identify the Real Hardcoded Secret

The app already has a hardcoded JWT secret in `backend/server.js`:

```javascript
const SECRET_KEY = 'your_jwt_secret';
```

This is a real security issue - no need to plant a test secret.

### Step 2: Use Agent Mode to Find Secrets

Open VS Code Agent Mode and submit:

```
#codebase

Scan the codebase for any hardcoded secrets, API keys, passwords, or sensitive configuration values. For each one found:
1. List the file and line number
2. Move the value to environment variables
3. Update the code to use process.env
4. Create a .env.example file listing required environment variables
```

### Step 3: Review Changes

Copilot should:

| Change | Expected |
| --- | --- |
| `backend/server.js` | Replace `'your_jwt_secret'` with `process.env.SECRET_KEY` or `process.env.JWT_SECRET` |
| `.env.example` | List `SECRET_KEY=` (without actual value) |
| `.gitignore` | Add `.env` if not already present |

### Step 4: Accept and Test

1.  Accept the changes
2.  Create a `.env` file locally:

```
SECRET_KEY=your_jwt_secret
```

1.  Restart the app: `npm start`
2.  Verify the app still works (login with **user1 / user1**)
3.  Run tests: `npm run test:backend`

### Validation

*   Hardcoded secret detected by Copilot
*   Secret moved to environment variable
*   `.env.example` created
*   `.gitignore` updated
*   App works with env-based config
*   Tests pass: `npm run test:backend`

---

## Exercise 3: Broad Vulnerability Audit - OWASP Pattern Review (Optional)

> **Purpose:** Go beyond scanners. Use Agent Mode as a security reviewer to audit the entire backend for OWASP-style vulnerabilities (injection, XSS, missing validation) that automated tools may miss. This teaches using AI as a code review partner for security, not just a code generator.

### Step 1: Request a Security Audit

```
#codebase

Review the backend code for common security vulnerabilities:
- SQL injection / NoSQL injection
- Cross-site scripting (XSS)
- Missing input validation
- Insecure authentication patterns

For each issue found, explain the risk and provide a fix.
```

### Step 2: Review and Apply Fixes

1.  Evaluate each suggestion
2.  Accept fixes that are appropriate
3.  Test the app after changes

### Validation

*   Security review completed
*   At least one vulnerability identified and fixed

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| No CodeQL alerts | Wait for analysis to complete, or check query suite is "Extended" |
| Agent can't read alert | Ensure the alert URL in the issue body is a valid, full GitHub link |
| Secret not detected | Ensure the hardcoded value looks like a real secret/key pattern |
