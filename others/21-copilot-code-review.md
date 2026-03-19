# Demo 6: GitHub Copilot Code Review - AI-Powered Pull Request Reviews

> \[!NOTE\]  
> This is a demo so it means that the trainer has to run the demo himself

Copilot code review is an agentic AI reviewer that understands your codebase, catches real bugs, and gives high-signal feedback directly on pull requests. Over 60 million reviews have been completed, now accounting for more than 1 in 5 code reviews on GitHub.

---

## Prerequisites

*   A GitHub account with **Copilot Pro, Pro+, Business, or Enterprise**
*   A repository created from [ps-copilot-sandbox/copilot-agent-and-mcp](https://github.com/ps-copilot-sandbox/copilot-agent-and-mcp) (reuse from previous demos or create fresh)
*   Repository cloned locally

---

## Lab 1: Security Bug Hunt - Your First Copilot Code Review

**Purpose:** Understand how Copilot code review acts as a security-focused reviewer that catches OWASP-style vulnerabilities (mass assignment, missing authorization, input validation) - issues that often slip past human reviewers in time-pressured PRs.

**What you'll learn:**

*   How to manually request Copilot as a PR reviewer
*   How to read multi-line review comments and suggested fixes
*   What categories of bugs Copilot prioritizes (security > style)
*   How to apply batch autofixes

### Step 1 - Create a branch with buggy code

1.  In your local clone, create a new branch:

```
git checkout -b feature/search-books
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Create a new git branch called feature/search-books and switch to it
> ```

1.  Open `backend/routes/index.js` and add the following route **before** the `module.exports` line:

```
// generated-by-copilot: search books endpoint with intentional issues
router.get('/books/search', (req, res) => {
  const query = req.query.q;
  const books = readJSON(booksFile);

  // Bug 1: No input validation - query could be undefined
  const results = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  // Bug 2: Returning all book data including internal fields
  // Bug 3: No pagination - could return thousands of results
  res.json(results);
});

// generated-by-copilot: bulk delete endpoint with intentional issues
router.post('/books/bulk-delete', authenticateToken, (req, res) => {
  const { ids } = req.body;
  let books = readJSON(booksFile);

  // Bug 4: No authorization check - any authenticated user can delete
  // Bug 5: No validation that ids is an array
  // Bug 6: Deleting in a loop without error handling
  ids.forEach(id => {
    books = books.filter(b => b.id !== id);
  });

  writeJSON(booksFile, books);
  res.json({ message: `Deleted ${ids.length} books` });
});

// generated-by-copilot: user preferences endpoint with intentional issues
router.put('/users/preferences', authenticateToken, (req, res) => {
  const users = readJSON(usersFile);
  const user = users.find(u => u.username === req.user.username);

  // Bug 7: Directly merging user input into the user object (mass assignment)
  Object.assign(user, req.body);

  writeJSON(usersFile, users);
  res.json(user);
});
```

1.  Commit and push the branch:

```
git add .
git commit -m "Add search, bulk delete, and user preferences endpoints"
git push origin feature/search-books
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Stage all changes, commit with message "Add search, bulk delete, and user preferences endpoints", and push to origin feature/search-books
> ```

### Step 2 - Create a Pull Request

1.  Go to your repository on GitHub.com
2.  Create a Pull Request from `feature/search-books` → `main`
3.  Title: `Add search, bulk delete, and user preferences endpoints`

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Create a pull request from feature/search-books to main with title "Add search, bulk delete, and user preferences endpoints"
> ```

### Step 3 - Request a Copilot Code Review

1.  In the PR, go to the **Reviewers** section on the right sidebar
2.  Select **Copilot** as a reviewer
3.  Wait for Copilot to analyze the code (typically 1-3 minutes)

### Step 4 - Explore the Review Comments

Walk through the review and observe:

*   **Multi-line comments**: Copilot attaches feedback to logical code ranges, not just single lines
*   **Suggested fixes**: Each comment includes a concrete code suggestion you can apply
*   **High-signal findings**: Copilot focuses on real issues (missing validation, security concerns, logic bugs) - not style nitpicks
*   **Silence when appropriate**: In 29% of reviews, Copilot says nothing if the code is fine

**Expected findings Copilot should flag:**

| # | Issue | Category |
| --- | --- | --- |
| 1 | `query` could be `undefined` causing a runtime crash | Input validation |
| 2 | No pagination on search results | Performance |
| 3 | No authorization check on bulk delete | Security |
| 4 | `ids` not validated as array | Input validation |
| 5 | Mass assignment via `Object.assign(user, req.body)` | Security |
| 6 | No error handling on bulk delete | Reliability |

### Step 5 - Apply Batch Autofixes

1.  Review the suggested changes from Copilot
2.  Click **"Commit suggestion"** on individual comments, or use **batch commit** to apply multiple fixes at once
3.  Observe how Copilot groups related issues together to reduce cognitive load

---

## Lab 2: Always-On Reviews - Automate Copilot on Every PR

**Purpose:** Shift from on-demand reviews to an always-on safety net. This lab configures Copilot to automatically review every pull request - turning code review into a DevOps guardrail rather than a manual step someone might forget.

**What you'll learn:**

*   How to configure automatic Copilot reviews at the repository level
*   How automatic reviews differ from manual requests (same quality, zero friction)
*   That Copilot catches production-readiness issues (missing `Retry-After` headers, memory leaks) not just logic bugs

### Step 1 - Enable Automatic Reviews

1.  Go to **Settings** → **Code and automation** → **Copilot** → **Code review**
2.  Select **"Copilot reviews all pull requests"**
3.  Save changes

### Step 2 - Test Automatic Reviews

1.  Create another branch with a small change:

```
git checkout main && git pull
git checkout -b feature/rate-limiting
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Switch to main, pull latest changes, then create and switch to a new branch called feature/rate-limiting
> ```

1.  Add this code to `backend/routes/index.js` before the `module.exports` line:

```
// generated-by-copilot: rate limiting with intentional retry issue
const rateLimitMap = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 100;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  requests.push(now);
  rateLimitMap.set(ip, requests);

  if (requests.length > maxRequests) {
    // Issue: No Retry-After header - clients won't know when to retry
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
}
```

1.  Commit, push, and create a PR:

```
git add .
git commit -m "Add rate limiting middleware"
git push origin feature/rate-limiting
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Stage all changes, commit with message "Add rate limiting middleware", push to origin feature/rate-limiting, and create a pull request to main
> ```

1.  **Do NOT manually assign Copilot** - observe that the review is triggered automatically
2.  Check the review findings (should flag the missing `Retry-After` header - a common issue)

---

## Lab 3: Personalize Reviews - Custom Coding Guidelines via Instructions Files

**Purpose:** Out of the box, Copilot catches generic bugs. But every team has its own conventions ("all list endpoints must paginate", "never expose internal IDs"). This lab teaches you to create an instructions file so Copilot enforces **your team's unwritten rules** - the ones that usually only live in a senior developer's head.

**What you'll learn:**

*   How to create an instructions file using the VS Code gear icon UI
*   YAML frontmatter (`applyTo`) and how Copilot scopes rules to files
*   The difference between Copilot's default findings vs. custom guideline-driven findings
*   How instructions files make onboarding faster - new developers get senior-level PR feedback automatically

### Step 1 - Create a Coding Guidelines Instructions File

1.  In VS Code, click the **gear icon** (⚙️) at the top of the Copilot Chat panel
2.  Select **"Instructions & Rules"**
3.  Click **"Create Instructions File"** (or **"Add File"**)
4.  Name the file: `copilot-code-review-instructions.md`
5.  It will be created under `.github/instructions/`
6.  Paste the following content into the file:

```
---
applyTo: "**"
---

## Code Review Guidelines

### API Endpoints
- All endpoints MUST validate input parameters before processing
- All endpoints MUST return proper HTTP status codes (400 for bad input, 404 for not found)
- All write endpoints MUST have authorization checks
- All list endpoints MUST support pagination (limit/offset)

### Security
- Never expose internal IDs or sensitive user fields in API responses
- Never use Object.assign or spread to merge user input directly into data objects
- Always sanitize user input before using in queries or filters

### Error Handling
- All async operations must have try/catch blocks
- Error responses must include a descriptive message but never stack traces
- Failed operations must not leave data in an inconsistent state

### Performance
- Any endpoint returning a list must support pagination
- Rate limiting must include a Retry-After header in 429 responses
```

1.  Save the file
2.  Verify the file appears under **Instructions & Rules** in the gear icon menu - this confirms Copilot will use these guidelines during code reviews
3.  Commit and push this file to `main`:

```
git add .github/instructions/copilot-code-review-instructions.md
git commit -m "Add code review guidelines instructions file"
git push origin main
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Stage the new file .github/instructions/copilot-code-review-instructions.md, commit with message "Add code review guidelines instructions file", and push to origin main
> ```

### Step 2 - Test Custom Guidelines

1.  Create a new branch:

```
git checkout main && git pull
git checkout -b feature/book-ratings
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Switch to main, pull latest changes, then create and switch to a new branch called feature/book-ratings
> ```

1.  Add this code to `backend/routes/index.js` before the `module.exports` line:

```
// generated-by-copilot: book ratings endpoint to test custom guidelines
router.post('/books/:id/rate', authenticateToken, (req, res) => {
  const books = readJSON(booksFile);
  const book = books.find(b => b.id == req.params.id);
  book.ratings = book.ratings || [];
  book.ratings.push(req.body);
  writeJSON(booksFile, books);
  res.json(book);
});

// generated-by-copilot: book ratings list endpoint
router.get('/books/:id/ratings', (req, res) => {
  const books = readJSON(booksFile);
  const book = books.find(b => b.id == req.params.id);
  res.json(book.ratings || []);
});
```

1.  Commit, push, and create a PR:

```
git add .
git commit -m "Add book ratings endpoints"
git push origin feature/book-ratings
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Stage all changes, commit with message "Add book ratings endpoints", push to origin feature/book-ratings, and create a pull request to main
> ```

1.  Request Copilot as a reviewer (or wait for automatic review)

### Step 3 - Compare Results

Observe that Copilot now flags issues **specific to your custom guidelines**:

*   Missing input validation on the rating value
*   No pagination on the ratings list
*   `book` could be `undefined` if ID not found (no 404)
*   `req.body` pushed directly without sanitization
*   Missing authorization on the GET ratings endpoint (per your guideline that write endpoints need auth, but also that list endpoints need pagination)

---

## Lab 4: The Feedback Loop - Fix, Push, Re-review

**Purpose:** A code review isn't a one-shot event. This lab demonstrates the iterative conversation between you and Copilot - fix what it flagged, push again, and observe Copilot re-review with memory of previous findings. This mirrors how you'd work with a human reviewer, but faster.

**What you'll learn:**

*   That Copilot maintains context/memory across review iterations on the same PR
*   How the agentic architecture reads linked issues and PR descriptions for deeper context
*   The fix → push → re-review workflow
*   What a "clean" re-review looks like (Copilot stays silent when issues are resolved)

### Step 1 - Fix Issues from Lab 3

1.  On your `feature/book-ratings` branch, update the code based on Copilot's suggestions:

```
// generated-by-copilot: book ratings endpoint - improved version
router.post('/books/:id/rate', authenticateToken, (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
  }

  const books = readJSON(booksFile);
  const book = books.find(b => b.id === parseInt(req.params.id));

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  book.ratings = book.ratings || [];
  book.ratings.push({
    rating,
    comment: comment ? String(comment).slice(0, 500) : '',
    user: req.user.username,
    date: new Date().toISOString()
  });

  writeJSON(booksFile, books);
  res.json({ rating, comment: comment || '', user: req.user.username });
});

// generated-by-copilot: book ratings list endpoint - improved version
router.get('/books/:id/ratings', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const offset = parseInt(req.query.offset) || 0;

  const books = readJSON(booksFile);
  const book = books.find(b => b.id === parseInt(req.params.id));

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const ratings = book.ratings || [];
  res.json({
    data: ratings.slice(offset, offset + limit),
    total: ratings.length,
    limit,
    offset
  });
});
```

1.  Commit and push the fix:

```
git add .
git commit -m "Fix book ratings endpoints based on Copilot review feedback"
git push origin feature/book-ratings
```

> **Copilot prompt alternative:** In Agent Mode, use this prompt:
> 
> ```
> Stage all changes, commit with message "Fix book ratings endpoints based on Copilot review feedback", and push to origin feature/book-ratings
> ```

1.  Request Copilot to re-review the updated PR
2.  Observe that previous issues are resolved and check for any new findings

### Step 2 - Discussion Points

Walk through with the audience:

*   Copilot maintains **memory across reviews** - it knows what it flagged before
*   The agentic architecture reads **linked issues and PR description** for context
*   Reviews average **~5.1 comments** per review - focused on what matters
*   Copilot stays **silent in 29% of reviews** when code is clean - silence is a good sign

---

## Summary

| Lab | Purpose | Key Skill |
| --- | --- | --- |
| Lab 1 | Security Bug Hunt | Manually request a review, read findings, apply autofixes |
| Lab 2 | Always-On Reviews | Configure automatic reviews as a DevOps guardrail |
| Lab 3 | Personalize Reviews | Create instructions files to enforce team conventions |
| Lab 4 | The Feedback Loop | Iterate with Copilot across fix → push → re-review cycles |

### Key Takeaways from the Blog Post

*   **Accuracy**: Copilot prioritizes consequential logic and maintainability issues
*   **Signal over noise**: High-signal comments > high volume - quality beats quantity
*   **Speed vs. depth**: A slightly slower review that catches real bugs beats instant noise
*   **Agentic architecture**: Copilot reads your repo, linked issues, and past patterns to give context-aware reviews
*   **12,000+ organizations** run automatic Copilot code reviews on every PR
