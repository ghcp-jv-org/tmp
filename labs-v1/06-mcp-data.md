# Lab 05 - Agent Mode + MCP: External Data Integration

> **Mode:** VS Code + MCP  
> **Duration:** 45 min  
> **Prerequisite:** [Lab 04](lab-04-mcp-builder.md) (MCP server built and running)

---

## Objective

Use the MCP server you built in Lab 04 to enrich the book application with real data. Copilot fetches verified data via MCP tools and uses it to enhance both data and UI.

| Exercise | Skill | What You Learn |
| --- | --- | --- |
| 1 | **Data enrichment via MCP tools** | Agent Mode calls MCP tools to fetch verified data and writes it into your files - AI working with real sources, not generating data |
| 2 | **MCP-informed UI generation** | Use the enriched data to generate a new UI component - the agent builds on the MCP data it just fetched |
| 3 | **GitHub MCP for issue-driven dev** | Use a different MCP server (GitHub) to create a structured issue from Agent Mode, then implement the feature from that issue |

---

## Exercise 1: Data Enrichment - Fetch Real Data via Book MCP Server

> **Purpose:** Watch Agent Mode call MCP tools to fetch verified book data (dates, descriptions) and write it directly into `books.json`. The key insight: Copilot is retrieving real data from an external source, not hallucinating it. This is the pattern for connecting AI to databases, APIs, or internal tools.

### Pre-requisite: Verify MCP Server is Connected

If the MCP server is not already running then start it:

1.  Open Command Palette: `Ctrl+Shift+P`
2.  Run: **MCP: Start MCP server**
3.  Select **book-database**

**Expected:** `Book database MCP Server running on stdio`

### Step 1: Open Agent Mode

1.  Open Copilot Chat: `Ctrl+Shift+I`
2.  Select **Agent Mode**

### Step 2: Update Book Data

Submit this prompt:

```
Update #file:books.json (without any script) to add the date and a description by using the information provided by the book-database MCP server.
```

### Step 3: Observe MCP Interaction

Watch the chat panel:

| Activity | What's Happening |
| --- | --- |
| Tool discovery | Copilot identifies the book-database MCP server |
| Data request | Copilot calls MCP to fetch book details |
| Data processing | Copilot formats the retrieved information |
| File update | Copilot proposes changes to `books.json` |

### Step 4: Review and Accept

1.  Review the proposed changes to `backend/data/books.json`
2.  Verify dates and descriptions look correct (real data, not hallucinated)
3.  Accept the changes

### Validation

*   Copilot called the MCP server (visible in chat)
*   `books.json` updated with dates and descriptions
*   Data is accurate (sourced from MCP, not generated)

---

## Exercise 2: MCP-Informed UI - Display Enhanced Book Details

> **Purpose:** Build a UI component that uses the enriched data from Exercise 1. The agent reads the updated `books.json` (now with dates and summaries from MCP) and generates a BookDetails component. This shows multi-step workflows: fetch data via MCP → update data → build UI on top of it.

### Step 1: Request UI Enhancement

```
#codebase

Can you display more information about a book (date, summary, and author)? We can maybe use a new component to display the book details outside the list.
```

### Step 2: Review Changes

Copilot should create/modify:

| File | Change |
| --- | --- |
| `components/BookDetails.jsx` | New component for detail view |
| `components/BookList.jsx` | Updated to handle book selection |
| `App.jsx` or routing | Integration of new component |
| `styles/` | Styling for the details view |

### Step 3: Accept and Test

1.  Accept the changes
2.  Refresh the app in browser
3.  Click on a book → verify date, summary, and author display
4.  Navigate back to the list

### Step 4: Refine

```
Add a back button to return to the book list from the details view.
```

### Validation

*   BookDetails component created
*   Clicking a book shows detailed info
*   Date, summary, and author display correctly
*   Back button returns to list

---

## Exercise 3: Issue-Driven Development - Book Categories via GitHub MCP

> **Purpose:** Switch to a different MCP server (GitHub MCP) to create a structured issue directly from Agent Mode, then implement the feature based on that issue. This teaches the issue-first workflow: describe requirements in an issue via MCP → implement from the issue spec.

This exercise uses the **GitHub MCP server** (not the book-database MCP) to create an issue, then implement the feature.

### Step 1: Configure GitHub MCP Server

Follow the setup instructions at [GitHub MCP Server Documentation](https://github.com/github/github-mcp-server?tab=readme-ov-file#usage-with-vs-code).

Ensure the MCP server can access your repository.

### Step 2: Create an Issue via Agent Mode

In Agent Mode:

```
I want to add a book categories feature

I want to track my changes in a GitHub Issue: write a detailed description for implementing book categories in our application?
  - Technical requirements
  - UI/UX considerations
  - Testing requirements
  - Acceptance criteria

Don't forget to add tests.
```

### Step 3: Verify Issue Creation

1.  Go to your repository on **GitHub.com**
2.  Open the **Issues** tab
3.  Find the newly created issue
4.  Verify it contains structured requirements and acceptance criteria
5.  Copy the issue URL

### Step 4: Implement the Feature

Back in Agent Mode:

```
Can you implement the book categories feature as described in the issue <ISSUE-URL>?
```

Replace `<ISSUE-URL>` with the actual URL from Step 3.

### Step 5: Review and Test

1.  Review generated code:
    *   Backend: category data or endpoints
    *   Frontend: category filter/badges on book cards
    *   Data: `books.json` updated with categories
    *   Tests: unit tests for category logic
2.  Accept changes
3.  Test in browser

### Validation

*   Issue created on GitHub via MCP
*   Issue has detailed requirements and acceptance criteria
*   Categories added to book data
*   Category filter or badges visible in UI
*   Tests pass: `npm run test:backend`

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| MCP server won't start | Check the path in `.vscode/mcp.json` points to `dist/index.js` (not `build/`) |
| "Server not found" | Run `npm install && npm run build` in `book-database-mcp-server/` |
| No data returned | Verify MCP server is running (check terminal panel) |
| Copilot ignores MCP | Restart VS Code and re-start the MCP server |