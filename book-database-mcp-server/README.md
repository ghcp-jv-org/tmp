# book-database-mcp-server

<!-- generated-by-copilot: README for book-database MCP server -->

An MCP (Model Context Protocol) server that serves a local book catalog from JSON data files. Uses stdio transport for local integration.

## Tools

| Tool | Description |
|---|---|
| `get_book_by_isbn` | Look up a single book by ISBN |
| `get_book_by_title` | Search books by title (partial, case-insensitive) |
| `get_books_by_isbn_list` | Look up multiple books by a list of ISBNs |
| `get_books_by_titles` | Search books matching multiple title strings |

## Setup

```bash
npm install
npm run build
```

## Usage

### stdio (local)

```bash
node dist/index.js
```

### VS Code MCP configuration

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "book-database": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/book-database-mcp-server/dist/index.js"]
    }
  }
}
```

## Data files

- `src/data/books.json` — ISBN, title, author
- `src/data/books-details.json` — ISBN, summary, date, author
