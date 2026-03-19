# Lab 00 - Prerequisites & Environment Setup

> **Duration:** 15 min  
> **Complete this before starting any lab.**

---

## Required Accounts & Access

| Requirement | Needed For |
| --- | --- |
| GitHub account with Copilot license | All labs |
| **Copilot Coding Agent** access | Labs 01, 03, 05-10 |
| **Copilot Chat Agent Mode** in VS Code | Labs 02, 04-08 |
| **GitHub Advanced Security** on repo | Lab 03 |
| **MCP server** access | Labs 04, 05, 06, 10 |
| **Node.js 20+** and **npm** installed | All labs |
| Personal Access Token (fine-grained) | Lab 03 |
| Azure subscription (optional) | Labs 08, 10 |

---

## Step 1: Clone the Repository

```
git clone https://github.com/ps-copilot-sandbox/copilot-agent-and-mcp.git
cd copilot-agent-and-mcp
```

## Step 2: Install and Start

```
npm install
npm start
```

This runs both backend and frontend concurrently.

**Expected output:**

```
Server running on http://localhost:4000
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Step 3: Verify the Application

1.  Open `http://localhost:5173` in your browser
2.  Confirm you see the book list
3.  Log in with **user1 / user1** (pre-existing test account)
4.  Add a book to favorites
5.  Verify the favorites page shows your selection

## Step 4: Verify VS Code Extensions

1.  Open the repo folder in VS Code
2.  Open Copilot Chat panel: `Ctrl+Shift+I`
3.  Confirm **Agent Mode** is available in the mode selector

## Step 5: Review Configuration Files

Open each file and confirm it exists:

```
Ctrl+P → .github/workflows/copilot-setup-steps.yml
Ctrl+P → .github/copilot-instructions.md
```

| File | Purpose |
| --- | --- |
| `.github/workflows/copilot-setup-steps.yml` | Environment setup for Coding Agent runs |
| `.github/copilot-instructions.md` | Custom instructions Copilot follows |

---

## Validation Checklist

*   Repository created from template
*   Backend running on port 4000
*   Frontend running on port 5173
*   App loads in browser with book list visible
*   VS Code has Copilot Chat with Agent Mode
*   Configuration files exist in `.github/`

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `npm install` fails | Verify Node.js 20+ with`node -version` |
| Port 4000 in use | Kill the process:`npx kill-port 4000` |
| Port 5173 in use | Kill the process:`npx kill-port 5173` |
| Agent Mode not available | Update VS Code and Copilot Chat extension |
| No Copilot access | Verify license at github.com/settings/copilot |
