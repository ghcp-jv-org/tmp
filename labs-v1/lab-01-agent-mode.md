# Lab 01 - Agent Mode: Interactive Feature Development

> **Mode:** VS Code (local)  
> **Duration:** 45 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md)

---

## Objective

Use GitHub Copilot Chat in Agent Mode to build features interactively in your IDE. Agent Mode reads your codebase, makes multi-file changes, runs commands, and iterates in real time.  
Each exercise teaches a different aspect of working with Agent Mode:

| Exercise | Skill | What You Learn |
| --- | --- | --- |
| 1 | **Autonomous scoping** | Give a minimal prompt - watch Agent Mode figure out what to build from codebase context alone |
| 2 | **Structured multi-file generation** | Give a detailed prompt - control exactly what gets built across components, state, and tests |
| 3 | **Plan mode vs. Agent Mode** | Use Plan mode first to review a safe blueprint, then Agent Mode to execute - learn when to plan before acting |
| \- | \- | \- |
| **Runs** | Locally in VS Code | Cloud (GitHub Actions) |
| **Trigger** | Chat prompt | Issue assignment |
| **Interaction** | Real-time, interactive | Async (wait for PR) |
| **Output** | Direct file edits | Pull Request |
| **Best for** | Quick iterations | Well-defined issues |

---

## Exercise 1: Autonomous Scoping - Comments on Favorites

> **Purpose:** Give Agent Mode a minimal, open-ended prompt and observe how it autonomously reads the codebase, identifies the right files, plans the architecture, and generates a full-stack feature - without you specifying routes, components, or state.

### Step 1: Open Agent Mode

1.  Open your repository in VS Code
2.  Open Copilot Chat: `Ctrl+Shift+I`
3.  Select **Agent Mode** in the mode selector

### Step 2: Submit the Feature Request

```
#codebase

Can you add a new feature that allows users to add a comment on a favorite?
```

This is intentionally short - observe how Copilot figures out the scope from codebase context.

### Step 3: Observe Copilot Working

Watch the chat panel as Copilot:

| Activity | What to Look For |
| --- | --- |
| Context gathering | Scans relevant files |
| Planning | Outlines needed changes |
| File identification | Lists files to modify/create |
| Code generation | Writes code for routes, components, state |

### Step 4: Review and Accept Changes

1.  Click through each proposed file change
2.  Use **Accept** or **Reject** buttons per change
3.  Check these areas:

| Area | Expected Changes |
| --- | --- |
| Backend | `routes/comments.js` - new route |
| Data | Comment storage structure |
| Frontend | Comment input + display component |
| State | Redux slice updates |

### Step 5: Test

```
# Restart the app if needed
npm start
```

1.  Open `http://localhost:5173`
2.  Log in with **user1 / user1** and navigate to favorites
3.  Add a comment on a favorite book
4.  Refresh - verify comment persists

### Step 6: Iterate

Ask follow-up questions to refine:

```
Add validation to ensure comments are not empty and limited to 500 characters.
```

Then:

```
Add the ability to delete a comment.
```

### Validation

*   Comments route created in backend
*   Comment UI renders on favorites page
*   Can add, view, and delete comments
*   Validation prevents empty/overlong comments

---

## Exercise 2: Structured Multi-File Generation - Book Search

> **Purpose:** Give Agent Mode a detailed, structured prompt that specifies the component, logic, state management, and tests you want. Observe how specificity gives you control over the output - you decide the architecture, Copilot executes it across multiple files.

### Step 1: Submit the Feature Request

```
#codebase

I want to add a search feature to the book list that filters books by title or author.
The search should work in real-time as the user types.

Help me create a SearchInput component that:
- Has a clean, modern design
- Shows a search icon
- Has a clear button
- Updates in real-time

Help me implement the filter logic to:
- Search in both title and author fields
- Be case-insensitive
- Handle special characters
- Update the list in real-time

Help me integrate the search state with Redux:
- Add search term to the store
- Update the book list selector
- Persist search state during navigation

Help me write tests for:
- The SearchInput component
- The filter logic
```

### Step 2: Monitor Multi-File Changes

Observe Copilot modifying files across the stack:

| Layer | Expected Changes |
| --- | --- |
| New component | `components/SearchInput.jsx` |
| Updated component | `components/BookList.jsx` - integrates search |
| State | `store/booksSlice.js` - search term state |
| Styles | New CSS for search input |
| Tests | Search component + filter logic tests |

### Step 3: Accept and Test

1.  Review each file change
2.  Accept changes
3.  Test in browser:
    *   Type in the search box - book list filters in real-time
    *   Search by title - matching books appear
    *   Search by author - matching books appear
    *   Click clear - full list returns

### Step 4: Iterate if Needed

```
The search feature isn't filtering correctly. Can you fix the issue?
```

Or improve it:

```
Can you add debouncing to the search to improve performance?
```

### Validation

*   SearchInput component created
*   BookList integrates with search filter
*   Search works for both title and author
*   Clear button resets search

---

## Exercise 3: Plan Mode vs. Agent Mode - When to Use Each

> **Purpose:** Compare two Copilot modes on the same feature request. Use **Plan mode** first to get a safe, reviewable plan without touching code. Then switch to **Agent Mode** with a refined prompt to execute. This teaches when to plan before acting - critical for risky or unfamiliar changes.

### Step 1: Plan Mode - Get a Plan Without Changing Code

1.  Switch Copilot Chat to **Plan mode** (look for the mode selector - choose "Ask" or "Plan" instead of "Agent")
2.  Submit:

```
#codebase

I want to add a "Reading Progress" feature to the favorites page. 
What changes would be needed? Don't make any changes yet - just outline the plan.
```

1.  Review the plan Copilot produces:
    *   Which files would it modify?
    *   What backend endpoint would it add?
    *   What frontend components would change?
    *   Does the plan make sense before any code is written?

**Key observation:** Plan mode gives you a reviewable blueprint - no files touched, no risk.

### Step 2: Agent Mode - Execute with a Specific Prompt

1.  Switch back to **Agent Mode**
2.  Now submit a precise prompt informed by the plan:

```
#codebase

Add a "Reading Progress" feature to the favorites page:
- Each favorite book gets a progress slider (0-100%)
- Progress is stored per user per book
- Backend: PATCH /api/favorites/:bookId/progress endpoint
- Frontend: progress bar component below each favorite book
- Include a "Mark as Complete" button that sets progress to 100%
```

1.  Review and accept the changes
2.  Test in browser

### Key Takeaway

| Mode | When to Use | Risk |
| --- | --- | --- |
| **Plan mode** | Unfamiliar codebase, risky changes, want to review before acting | None - no files changed |
| **Agent Mode** | You know what you want, ready to execute | Medium - files are modified directly |
| **Plan → Agent** | Best practice: plan first, then execute with a refined prompt | Low - informed changes |

### Validation

*   Plan mode produced a reviewable plan without modifying files
*   Agent Mode executed the feature based on a specific prompt
*   Could compare the plan vs. actual implementation

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Agent Mode not available | Update VS Code + Copilot Chat extension |
| Copilot doesn't see files | Use `#codebase` to provide full context |
| Changes break the app | Ask: "The app crashes after your changes. Can you debug and fix?" |
| Too many files changed | Be more specific in your prompt about scope |
