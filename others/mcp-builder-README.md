# Lab: Build an MCP Server Using the Anthropic MCP Builder Skill

## Overview

In this lab you will use the **Anthropic MCP Builder skill** ([github.com/anthropics/skills/tree/main/skills/mcp-builder](https://github.com/anthropics/skills/tree/main/skills/mcp-builder)) to build a fully functional MCP (Model Context Protocol) server from scratch. The server will expose a **Book Database** - the same domain as the reference implementation in `../copilot-mcp` - but you will build it by prompting GitHub Copilot in Agent Mode with the MCP Builder skill installed.

### What You Will Learn

*   How to install and activate the Anthropic MCP Builder skill in GitHub Copilot (VS Code)
*   How to prompt the agent to scaffold, implement, and test an MCP server
*   MCP concepts: tools, transports, Zod validation, structured responses
*   Best practices for tool naming, error handling, and project structure

### Prerequisites

| Requirement | Details |
| --- | --- |
| **Node.js** | v18 or later |
| **npm** | Bundled with Node.js |
| **VS Code** | With GitHub Copilot extension (Agent Mode enabled) |
| **MCP Builder skill** | Installed as a VS Code Agent Skill (see Part 1) |

### Time Estimate

45 - 60 minutes

---

## Part 1 - Install the MCP Builder Skill (5 min)

The MCP Builder skill is a set of markdown instructions that teaches AI agents how to create high-quality MCP servers. It is published in the Anthropic skills repository:

```
https://github.com/anthropics/skills/tree/main/skills/mcp-builder
```

GitHub Copilot in VS Code supports **Agent Skills** - portable folders of instructions, scripts, and resources that Copilot loads on-demand. Skills can be stored as **project skills** (in your repo) or **personal skills** (in your user profile). Below are two options.

### Option A - Project Skill (recommended for this lab)

Store the skill in this repository so every collaborator gets it automatically. VS Code automatically discovers skills in `.github/skills/`, `.agents/skills/`, and `.claude/skills/` directories.

**Step 1 - Create the skills directory in the workspace root:**

```
mkdir -p .github/skills/mcp-builder/reference
```

**Step 2 - Download the skill files from the Anthropic repository into that directory:**

```
# Download the main SKILL.md
curl -L -o .github/skills/mcp-builder/SKILL.md \
  https://raw.githubusercontent.com/anthropics/skills/main/skills/mcp-builder/SKILL.md

# Download the reference files
curl -L -o .github/skills/mcp-builder/reference/mcp_best_practices.md \
  https://raw.githubusercontent.com/anthropics/skills/main/skills/mcp-builder/reference/mcp_best_practices.md

curl -L -o .github/skills/mcp-builder/reference/node_mcp_server.md \
  https://raw.githubusercontent.com/anthropics/skills/main/skills/mcp-builder/reference/node_mcp_server.md

curl -L -o .github/skills/mcp-builder/reference/python_mcp_server.md \
  https://raw.githubusercontent.com/anthropics/skills/main/skills/mcp-builder/reference/python_mcp_server.md

curl -L -o .github/skills/mcp-builder/reference/evaluation.md \
  https://raw.githubusercontent.com/anthropics/skills/main/skills/mcp-builder/reference/evaluation.md
```

> **Windows (PowerShell) alternative:** Replace `curl -L -o` with `Invoke-WebRequest -Uri <URL> -OutFile <PATH>` and `mkdir -p` with `New-Item -ItemType Directory -Force -Path`.

**Step 3 - Verify the structure:**

```
.github/skills/mcp-builder/
├── SKILL.md                          # Main skill instructions (loaded on-demand)
└── reference/
    ├── mcp_best_practices.md         # Server/tool naming, response formats, security
    ├── node_mcp_server.md            # TypeScript: project structure, Zod, registerTool
    ├── python_mcp_server.md          # Python: FastMCP, Pydantic, @mcp.tool patterns
    └── evaluation.md                 # Evaluation question creation and runner
```

> **Note:** This repo already includes the skill at `.github/skills/mcp-builder/`. If the files are already present, skip to **Verify the Skill is Loaded** below.

### Option B - Use the `/create-skill` shortcut

If you prefer an AI-assisted approach (Copilot generates the skill from the Anthropic source):

1.  Open GitHub Copilot Chat in VS Code.
2.  Type `/create-skill` and describe: _"A skill for building MCP servers based on the Anthropic MCP Builder guide at https://github.com/anthropics/skills/tree/main/skills/mcp-builder"_.
3.  Copilot will generate a `SKILL.md` file and reference docs. Review and save to `.github/skills/mcp-builder/`.

### Verify the Skill is Loaded

1.  Open the Command Palette (`Ctrl+Shift+P`) and run **Chat: Open Chat Customizations**.
2.  Under the **Skills** category, confirm `mcp-builder` appears in the list.
3.  Alternatively, type `/` in the Copilot Chat input - `mcp-builder` should appear as a slash command.
4.  Ask Copilot:

> "Do you have the MCP Builder skill loaded? Summarize the four phases of building an MCP server."

Expected answer should mention: **(1) Deep Research & Planning → (2) Implementation → (3) Review & Test → (4) Create Evaluations**.

> **Tip:** Type `/skills` in the chat input to quickly open the Configure Skills menu and toggle skills on/off.

---

## Part 2 - Understand the Domain (5 min)

Before prompting Copilot, review the data that the MCP server will serve. The data files are already available in the workspace under `../copilot-mcp/src/data/`:

| File | Contents |
| --- | --- |
| `books.json` | Array of book objects with `ISBN`, `title`, `author` |
| `books-details.json` | Object with a `books` array containing `ISBN`, `summary`, `date`, `author` |

### Exercise 2.1 - Explore the Data

Open both JSON files and answer these questions:

1.  How many books are in `books.json`?
2.  What fields does each entry in `books-details.json` contain beyond what `books.json` has?
3.  Which books appear in `books-details.json` but not in `books.json` (if any)?

> **Tip:** You can ask Copilot: _"Read the files in ../copilot-mcp/src/data/ and summarize the schema and counts."_

---

## Part 3 - Scaffold the Project (10 min)

Now use the MCP Builder skill to create the project from scratch **in this folder** (`mcp-builder/`).

### Exercise 3.1 - Prompt Copilot to Scaffold

In GitHub Copilot Chat (Agent Mode), use a prompt like:

> "Using the MCP Builder skill, create a new TypeScript MCP server project in this folder. The server should be called **book-database-mcp-server** and will serve a local book catalog from JSON files. Use stdio transport. Follow the recommended project structure from the skill's TypeScript guide. Copy the data files from `../copilot-mcp/src/data/` into the new project."

### What Copilot Should Generate

After Copilot completes scaffolding, verify that your folder structure looks like this:

```
mcp-builder/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts
│   └── data/
│       ├── books.json
│       └── books-details.json
```

### Exercise 3.2 - Review the Generated Config

Open the generated `package.json` and `tsconfig.json`. Verify:

*   `"type": "module"` is set in package.json
*   Dependencies include `@modelcontextprotocol/sdk` and `zod`
*   `"strict": true` is set in tsconfig.json
*   `outDir` points to `./dist` (or `./build`)
*   `rootDir` points to `./src`
*   A `build` script is defined (e.g., `"build": "tsc"`)

### Exercise 3.3 - Install Dependencies and Build

```
cd mcp-builder
npm install
npm run build
```

Fix any compilation errors Copilot may have introduced before moving on.

---

## Part 4 - Implement the Tools (15 min)

Now instruct Copilot to implement the MCP tools. The server should expose **four tools** matching the reference implementation:

| Tool Name | Description | Input | Data Source |
| --- | --- | --- | --- |
| `get_book_by_isbn` | Get detailed book info by ISBN | `isbn: string (10 chars)` | `books-details.json` |
| `get_book_by_title` | Get basic book info by title | `title: string` | `books.json` |
| `get_books_by_titles` | Get basic info for multiple books | `titles: string[]` | `books.json` |
| `get_books_by_isbn_list` | Get detailed info for multiple books | `isbn_list: string[] (10-char items)` | `books-details.json` |

### Exercise 4.1 - Prompt for Tool Implementation

> "Using the MCP Builder skill best practices, implement four tools in the book-database MCP server: `get_book_by_isbn`, `get_book_by_title`, `get_books_by_titles`, and `get_books_by_isbn_list`. Use `server.registerTool()` (the modern API). Each tool should have Zod input schemas with `.strict()`, proper `title`, `description`, `inputSchema`, and `annotations` (all are read-only, non-destructive, idempotent). Return formatted text responses. Handle not-found cases with clear error messages."

### Exercise 4.2 - Review the Implementation

After Copilot generates the code, check these quality criteria from the MCP Builder skill:

*   Uses `server.registerTool()` (NOT the deprecated `server.tool()`)
*   Each tool has `title`, `description`, `inputSchema`, and `annotations`
*   `annotations` include `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`
*   Zod schemas use `.strict()` to reject extra fields
*   Zod fields have `.describe()` for discoverability
*   ISBN validation enforces exactly 10 characters
*   Not-found errors are clear and actionable
*   No use of TypeScript `any` type (use proper types or `unknown`)
*   All async functions have explicit `Promise<T>` return types

### Exercise 4.3 - Build and Fix

```
npm run build
```

Iterate with Copilot until the build succeeds with zero errors.

### Exercise 4.4 - Run the Server

Start the server to confirm it launches without runtime errors:

```
cd book-database-mcp-server
node dist/index.js
```

You should see this message on stderr:

```
Book database MCP Server running on stdio
```

The server is now listening on stdio. Since there is no interactive client connected, the process will hang waiting for input - that is expected.

Press `Ctrl+C` to stop the server.

### Exercise 4.5 - Validate the Transport Handshake

Send a raw MCP `initialize` request via stdin to confirm the server responds correctly:

**PowerShell:**

```
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1.0"}}}' | node dist/index.js
```

**macOS / Linux:**

```
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1.0"}}}' | node dist/index.js
```

Verify the response includes:

*   `"name": "book-database-mcp-server"`
*   `"version": "1.0.0"`
*   A `capabilities` object listing `tools`

If the server crashes or returns an error, check that `dist/index.js` exists and the data files are present under `src/data/` (or the path your service resolves to).

---

## Part 5 - Test with MCP Inspector (10 min)

The MCP Inspector is an interactive tool for testing MCP servers.

### Exercise 5.1 - Launch the Inspector

```
npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a browser UI where you can:

1.  See all registered tools
2.  Call tools with sample inputs
3.  View raw JSON responses

### Exercise 5.2 - Test Each Tool

Run these test calls in the Inspector:

| Test | Tool | Input | Expected Result |
| --- | --- | --- | --- |
| 1 | `get_book_by_isbn` | `{ "isbn": "0451524935" }` | Returns details for "1984" by George Orwell |
| 2 | `get_book_by_title` | `{ "title": "The Hobbit" }` | Returns ISBN `0547928227`, author J.R.R. Tolkien |
| 3 | `get_books_by_titles` | `{ "titles": ["1984", "Brave New World"] }` | Returns two book entries |
| 4 | `get_books_by_isbn_list` | `{ "isbn_list": ["0451524935", "0547928227"] }` | Returns details for 1984 and The Hobbit |
| 5 | `get_book_by_isbn` | `{ "isbn": "0000000000" }` | Returns a not-found error message |
| 6 | `get_book_by_isbn` | `{ "isbn": "short" }` | Returns a Zod validation error (not 10 chars) |

### Exercise 5.3 - Document Your Results

For each test, note:

*   Did the tool return the expected result?
*   Was the error message actionable when the input was invalid?
*   Were there any unexpected behaviors?

---

## Part 6 - Wire Up to VS Code (5 min)

### Exercise 6.1 - Create an MCP Configuration

Create (or update) `.vscode/mcp.json` in the **workspace root** to register your new server:

```
{
  "servers": {
    "book-database": {
      "type": "stdio",
      "command": "node",
      "args": ["book-database-mcp-server\\dist\\index.js"]
    }
  }
}
```

### Exercise 6.2 - Test in Copilot Chat

Open GitHub Copilot Chat (Agent Mode) and ask:

> "Use the book-database MCP server to find details about the book '1984'."

Copilot should invoke the `get_book_by_isbn` or `get_book_by_title` tool and return the book information.

Try a follow-up:

> "Now get the summaries for The Hobbit and Pride and Prejudice."

---

## Part 7 - Enhance the Server (Bonus, 10 min)

Apply additional MCP Builder skill best practices to improve your server.

### Exercise 7.1 - Add a Search Tool

Prompt Copilot:

> "Add a `search_books` tool that takes a `query` string and searches both title and author fields using case-insensitive partial matching. Support `limit` and `offset` pagination parameters following MCP best practices. Return results with `total`, `count`, `has_more`, and `next_offset` metadata."

### Exercise 7.2 - Add Response Format Support

Prompt Copilot:

> "Update all tools to support a `response_format` parameter that accepts 'json' or 'markdown' (default 'markdown'). In JSON mode, return structured data. In markdown mode, return human-readable formatted text with headers and lists."

### Exercise 7.3 - Add Character Limit Protection

Prompt Copilot:

> "Add a CHARACTER\_LIMIT constant (25000 chars). If any tool response exceeds this limit, truncate the results and include a truncation message advising the user to use pagination or filters."

---

## Comparison: Reference vs. Your Build

After completing the lab, compare your implementation with the reference in `../copilot-mcp/`:

| Aspect | Reference (`copilot-mcp`) | Your Build (`mcp-builder`) |
| --- | --- | --- |
| API style | `server.tool()` (older) | `server.registerTool()` (modern) |
| Tool naming | kebab-case (`get-book-by-isbn`) | snake\_case (`get_book_by_isbn`) |
| Annotations | Not included | Included (readOnly, destructive, idempotent) |
| Zod `.strict()` | Not used | Used |
| Input descriptions | Minimal | Descriptive with `.describe()` |
| Error handling | Basic `throw` | Actionable error messages |
| Pagination | Not supported | Supported (bonus exercise) |
| Response formats | Text only | JSON + Markdown (bonus exercise) |

---

## Troubleshooting

| Problem | Solution |
| --- | --- |
| `npm run build` fails with import errors | Ensure `"type": "module"` in package.json and `"module": "Node16"` in tsconfig.json |
| MCP Inspector won't connect | Make sure `dist/index.js` exists - run `npm run build` first |
| Tools not appearing in Copilot | Restart VS Code after updating `.vscode/mcp.json` |
| `Cannot find module './data/books.json'` | Ensure JSON files are copied to `dist/data/` or use `resolveJsonModule` in tsconfig |
| Copilot uses `server.tool()` instead of `server.registerTool()` | Re-prompt: "Use `server.registerTool()` - the modern API, not the deprecated `server.tool()`" |

---

## Key Takeaways

1.  **The MCP Builder skill provides a structured 4-phase workflow** - planning, implementation, review, and evaluation - that produces production-quality MCP servers.
2.  **Tool design matters** - clear names, Zod validation, annotations, and actionable errors make tools discoverable and reliable for AI agents.
3.  **Modern APIs** (`registerTool`) provide better type safety and configuration than legacy APIs (`tool()`).
4.  **MCP Inspector** is essential for testing - always verify tools before wiring them into an AI client.
5.  **Prompting with skill context** yields significantly better results than generic "build me an MCP server" prompts.
6.  **Agent Skills** are portable across GitHub Copilot in VS Code, Copilot CLI, and Copilot coding agent - install once and use everywhere.

---

## Additional Resources

*   [MCP Specification](https://modelcontextprotocol.io)
*   [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
*   [Anthropic MCP Builder Skill](https://github.com/anthropics/skills/tree/main/skills/mcp-builder)
*   [MCP Inspector](https://www.npmjs.com/package/@modelcontextprotocol/inspector)
*   [VS Code Agent Skills Documentation](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
*   [Agent Skills Specification](https://agentskills.io/)
