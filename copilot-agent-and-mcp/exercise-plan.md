# Exercise Plan - Demos & Hands-On Analysis

> **Source folders analyzed:**  
> - `copilot-agent-and-mcp/demos/` (5 trainer demos)  
> - `copilot-agent-and-mcp/hands-on/` (5 participant exercises)

---

## 1. Inventory of Existing Content

### Demos (Trainer-Led)

| ID | File | Title | Mode | Complexity | Feature |
|--|---|----|---|------|-----|
| D1 | `01-coding-agent-basic.md` | Remove book from favorites | GitHub.com | Basic | Coding Agent assigns issue → PR |
| D2 | `02-coding-agent-medium.md` | User roles (member/admin) | GitHub.com | Medium | Multi-file Coding Agent + PR iteration |
| D3 | `11-agent-mode-basic.md` | Add comment on favorite | VS Code | Basic | Agent Mode multi-file editing |
| D4 | `12-coding-agent-advanced.md` | Fix CodeQL vulnerability | GitHub.com + MCP | Advanced | Coding Agent + GitHub MCP + security |
| D5 | `13-agent-mode-advanced.md` | Enrich book data via MCP | VS Code + MCP | Medium | Agent Mode + custom MCP server |

### Hands-On (Participant Self-Guided)

| ID | File | Title | Mode | Feature |
|--|---|----|---|-----|
| E1 | `01-coding-agent-exercises.md` | Clear All Favorites | GitHub.com | Issue → Copilot → PR (basic) |
| E2 | `01-coding-agent-exercises.md` | Book List Sorting | GitHub.com | Multi-file changes, state mgmt |
| E3 | `01-coding-agent-exercises.md` | Book Reviews (3 linked issues) | GitHub.com + MCP | Complex: linked issues + MCP coordination |
| E4 | `02-chat-agent-exercises.md` | Book Search (real-time) | VS Code | Agent Mode multi-file editing |
| E5 | `02-chat-agent-exercises.md` | Book Categories via MCP | VS Code + MCP | GitHub MCP issue creation → implementation |

---

## 2. Content Quality Assessment

### Strengths

| Aspect | Details |
|----|-----|
| **Progressive complexity** | Both tracks escalate: basic → medium → advanced |
| **Exact prompts provided** | Every exercise has a copy-paste-ready prompt in a code block |
| **Two modalities covered** | Coding Agent (async/cloud) and Agent Mode (interactive/local) |
| **MCP integration** | Both tracks cover MCP - GitHub MCP (security) and custom MCP (data) |
| **Linked issues pattern** | Exercise 3 teaches multi-issue coordination - high practical value |
| **Issue templates** | E1-E3 have well-structured issue templates with requirements sections |

### Gaps & Issues

| Issue | Severity | Details |
|----|-----|-----|
| **No validation/success criteria** | 🔴 High | Demos have no checklists. Hands-on has learning objectives but no pass/fail criteria |
| **No expected outputs** | 🔴 High | Neither track shows what the learner should see at each step |
| **No troubleshooting** | 🟡 Medium | No guidance when things go wrong (common with agent workflows) |
| **Demo ≠ Exercise duplication** | 🟡 Medium | D1 (remove favorites) and E1 (clear all favorites) are nearly identical |
| **D3/E4 mismatch** | 🟡 Medium | Demo 3 builds comments; Exercise 4 builds search - different features, same skill. No reuse |
| **No test execution** | 🟡 Medium | Exercises mention "include tests" but never run `npm test` to verify |
| **No time estimates per exercise** | 🟢 Low | README says "45-60 min" total but nothing per exercise |
| **No setup verification** | 🟢 Low | No step to confirm the app is running before starting exercises |
| **Inconsistent formatting** | 🟢 Low | Demos use numbered lists; exercises use `###` headings with nested steps |

### Content Overlap Between Demos & Hands-On

```
DEMOS                          HANDS-ON
──────                         ────────
D1: Remove favorites      ≈    E1: Clear all favorites     ← same Coding Agent basic flow
D2: User roles             ≈    E2: Book sorting            ← same Coding Agent multi-file
D3: Comments (Agent Mode)  ~    E4: Search (Agent Mode)     ← same skill, different feature
D4: CodeQL + MCP           ─    (no hands-on equivalent)    ← GAP: no security exercise
D5: MCP data enrichment    ≈    E5: MCP categories          ← same MCP + Agent Mode flow
                                E3: Reviews (linked issues)  ← UNIQUE: no demo equivalent
```

---

## 3. Consolidated Exercise Plan

### Design Principles
1. **Demo then Do** - Each demo maps to a hands-on exercise building the same skill with a different feature
2. **No duplication** - Demos and exercises target different features
3. **Every exercise has:** exact prompts, expected outputs, validation checklist, time estimate
4. **Progressive:** Basic → Multi-file → MCP → Complex

---

### Proposed Session Flow (Total: ~3 hours)

```
┌──────────────────────────────────────────────────────────────────┐
│  PART 1: Coding Agent (GitHub.com)              ~60 min         │
├──────────────────────────────────────────────────────────────────┤
│  Demo D1: Remove favorites (trainer shows flow)      10 min     │
│  Exercise E1: Clear All Favorites (participants do)  15 min     │
│  Demo D2: User roles + PR iteration (trainer)        10 min     │
│  Exercise E2: Book Sorting (participants)             15 min     │
│  Exercise E3: Book Reviews + linked issues            10 min*   │
│  * E3 is assign-and-wait; start it, move to Part 2              │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│  PART 2: Agent Mode (VS Code)                   ~45 min         │
├──────────────────────────────────────────────────────────────────┤
│  Demo D3: Comments feature (trainer shows flow)      10 min     │
│  Exercise E4: Book Search (participants do)          20 min     │
│  Check E3 PR: Review the linked-issues PR            15 min     │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│  PART 3: MCP Integration                        ~45 min         │
├──────────────────────────────────────────────────────────────────┤
│  Demo D4: CodeQL fix via MCP (trainer shows)         10 min     │
│  Demo D5: Book data enrichment via MCP (trainer)     10 min     │
│  Exercise E5: Book Categories via MCP (participants) 25 min     │
└──────────────────────────────────────────────────────────────────┘
```

---

### Exercise Details

#### Exercise E1: Clear All Favorites Button
- **Skill:** Coding Agent basic workflow
- **Mode:** GitHub.com
- **Time:** 15 min (5 min setup + 7 min agent wait + 3 min review)
- **Prompt:**
  ```
  Title: Add Clear All Favorites button

  Description:
  As a user, I want to be able to clear all my favorite books at once with a single button click.

  Requirements:
  - Add a "Clear All" button in the Favorites section
  - Show a confirmation dialog before clearing
  - Update both frontend and backend to support this feature
  - Add appropriate error handling
  - Include tests for the new functionality
  ```
- **Steps:** Create issue → Assign to Copilot → Verify 👀 → Monitor Actions → Review PR → Pull + test locally
- **Expected output:** PR with changes to favorites route, Favorites component, and a test file
- **Validation:**
  - [ ] Issue created
  - [ ] 👀 reaction visible
  - [ ] PR created within ~7 min
  - [ ] Clear All button works in app
  - [ ] Backend tests pass: `npm run test:backend`

---

#### Exercise E2: Book List Sorting
- **Skill:** Coding Agent multi-file changes
- **Mode:** GitHub.com
- **Time:** 15 min
- **Prompt:**
  ```
  Title: Add book list sorting options

  Description:
  As a user, I want to be able to sort the book list by different criteria (title, author) to better organize and find books.

  Requirements:
  - Add sorting options (dropdown or buttons) for title and author
  - Implement sorting on both frontend and backend
  - Maintain sort state when navigating
  - Add visual indication of current sort order
  - Include unit and integration tests
  ```
- **Steps:** Create issue → Assign → Monitor → Review PR → Test
- **Expected output:** PR touching BookList component, Redux store, backend route, and tests
- **Validation:**
  - [ ] Sort UI controls visible
  - [ ] Sorting works for title A-Z, Z-A and author A-Z, Z-A
  - [ ] Sort state persists across navigation
  - [ ] Tests pass

---

#### Exercise E3: Book Reviews (Linked Issues)
- **Skill:** Complex multi-issue coordination + MCP
- **Mode:** GitHub.com
- **Time:** 10 min to set up (agent works async while you do Part 2)
- **Prompts:** Three issues:
  1. **Frontend Issue** - Reviews UI components (star rating, review text, display list)
  2. **Backend Issue** - Reviews API (POST/GET endpoints, validation, tests)
  3. **Main Issue** - Links to both with `#[issue-number]` references
- **Steps:** Create 3 issues → Assign main issue to Copilot → Move to Part 2 → Return to review PR
- **Expected output:** PR implementing full-stack reviews with frontend components, API routes, and tests
- **Validation:**
  - [ ] 3 issues created with proper links
  - [ ] Agent reads linked issues (visible in timeline)
  - [ ] Frontend + backend implemented in single PR
  - [ ] Reviews can be added and displayed

---

#### Exercise E4: Book Search
- **Skill:** Agent Mode interactive development
- **Mode:** VS Code
- **Time:** 20 min
- **Prompt:**
  ```
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
- **Steps:** Open Agent Mode → Submit prompt → Review each file change → Accept → Test in browser → Iterate if needed
- **Expected output:** New SearchInput component, updated BookList, Redux store changes, test files
- **Validation:**
  - [ ] Search input visible in UI
  - [ ] Typing filters books in real-time
  - [ ] Works for both title and author
  - [ ] Clear button resets search
  - [ ] `npm run test:backend` passes

---

#### Exercise E5: Book Categories via MCP
- **Skill:** GitHub MCP + Agent Mode
- **Mode:** VS Code + MCP
- **Time:** 25 min
- **Setup:** Configure GitHub MCP server per [instructions](https://github.com/github/github-mcp-server?tab=readme-ov-file#usage-with-vs-code)
- **Prompt 1 (create issue):**
  ```
  I want to add a book categories feature

  I want to track my changes in a GitHub Issue: can you help me write a detailed
  description for implementing book categories in our application?
    - Technical requirements
    - UI/UX considerations
    - Testing requirements
    - Acceptance criteria

  Don't forget to add tests.
  ```
- **Prompt 2 (implement):**
  ```
  Can you implement the book categories feature as described in the issue [issue_link]?
  ```
- **Steps:** Configure MCP → Create issue via prompt 1 → Verify on GitHub.com → Implement via prompt 2 → Review → Test
- **Expected output:** GitHub issue created via MCP; categories added to book data; filter UI; tests
- **Validation:**
  - [ ] Issue created on GitHub via MCP
  - [ ] Issue has detailed requirements and acceptance criteria
  - [ ] Categories added to book data
  - [ ] Category filter/badges in UI
  - [ ] Tests pass

---

## 4. Recommendations

### Immediate Fixes (Apply to Current Files)

| # | What | Where |
|--|---|----|
| 1 | Add validation checklists to every exercise | `01-coding-agent-exercises.md`, `02-chat-agent-exercises.md` |
| 2 | Add expected outputs after each step | Both exercise files |
| 3 | Add `npm run test:backend` as a verification step in every exercise | Both exercise files |
| 4 | Add time estimates per exercise to the README | `hands-on/README.md` |
| 5 | Add a setup verification step (confirm app runs) at the top of each exercise file | Both exercise files |
| 6 | Add a troubleshooting table to each exercise file | Both exercise files |

### Structural Improvements

| # | What | Why |
|--|---|---|
| 1 | Start E3 at the end of Part 1, review in Part 2 | Uses agent wait time productively |
| 2 | Add a security exercise (hands-on) matching D4 | Currently demo-only - biggest gap |
| 3 | Align demo features ≠ exercise features | Avoids repetition, maximizes coverage |
| 4 | Standardize formatting across all 7 files | Currently inconsistent between demos and exercises |

### Feature Coverage Map (After Recommendations)

```
Skill                      Demo    Exercise    Status
─────────────────────────  ──────  ──────────  ──────
Coding Agent basic         D1 ✅   E1 ✅       Covered
Coding Agent multi-file    D2 ✅   E2 ✅       Covered
Coding Agent + PR iterate  D2 ✅   (in E2)     Covered
Agent Mode basic           D3 ✅   E4 ✅       Covered
Coding Agent + MCP/security D4 ✅  (none)      ⚠️ Demo only - add hands-on
Agent Mode + MCP data      D5 ✅   E5 ✅       Covered
Multi-issue coordination   (none)  E3 ✅       Exercise only (OK - advanced)
```
