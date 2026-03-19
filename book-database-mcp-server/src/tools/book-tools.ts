// generated-by-copilot: Tool registrations for book-database MCP server

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  GetBookByIsbnSchema,
  GetBookByTitleSchema,
  GetBooksByIsbnListSchema,
  GetBooksByTitlesSchema,
  type GetBookByIsbnInput,
  type GetBookByTitleInput,
  type GetBooksByIsbnListInput,
  type GetBooksByTitlesInput,
} from "../schemas/book-schemas.js";
import {
  getBookByIsbn,
  searchBooksByTitle,
  getBooksByIsbns,
  searchBooksByTitles,
} from "../services/book-service.js";
import type { BookWithDetails } from "../types.js";
import { CHARACTER_LIMIT } from "../constants.js";

function formatBookMarkdown(book: BookWithDetails): string {
  const lines = [`## ${book.title}`, `- **Author**: ${book.author}`, `- **ISBN**: ${book.ISBN}`];
  if (book.date) lines.push(`- **Published**: ${book.date}`);
  if (book.summary) lines.push(`- **Summary**: ${book.summary}`);
  return lines.join("\n");
}

function formatBooksResponse(booksResult: BookWithDetails[], label: string) {
  if (booksResult.length === 0) {
    return {
      content: [{ type: "text" as const, text: `No books found for ${label}.` }],
    };
  }

  const markdown = [`# Results for ${label}`, "", ...booksResult.map(formatBookMarkdown)].join("\n\n");

  let text = markdown;
  if (text.length > CHARACTER_LIMIT) {
    const truncated = booksResult.slice(0, Math.max(1, Math.floor(booksResult.length / 2)));
    text = [
      `# Results for ${label} (truncated)`,
      "",
      ...truncated.map(formatBookMarkdown),
      "",
      `_Showing ${truncated.length} of ${booksResult.length} results. Narrow your search for more specific results._`,
    ].join("\n\n");
  }

  return {
    content: [{ type: "text" as const, text }],
  };
}

export function registerBookTools(server: McpServer): void {
  server.registerTool(
    "get_book_by_isbn",
    {
      title: "Get Book by ISBN",
      description: `Look up a single book by its ISBN and return full details including title, author, publication date, and summary.

Args:
  - isbn (string): The ISBN of the book to look up

Returns:
  Book object with ISBN, title, author, date, and summary if found. Error message if not found.`,
      inputSchema: GetBookByIsbnSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetBookByIsbnInput) => {
      const book = getBookByIsbn(params.isbn);
      if (!book) {
        return {
          content: [{ type: "text" as const, text: `No book found with ISBN '${params.isbn}'.` }],
        };
      }
      return {
        content: [{ type: "text" as const, text: formatBookMarkdown(book) }],
      };
    }
  );

  server.registerTool(
    "get_book_by_title",
    {
      title: "Get Book by Title",
      description: `Search for books whose title contains the given string (case-insensitive). Returns full details for all matching books.

Args:
  - title (string): The title (or partial title) to search for

Returns:
  Array of matching book objects with ISBN, title, author, date, and summary.`,
      inputSchema: GetBookByTitleSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetBookByTitleInput) => {
      const results = searchBooksByTitle(params.title);
      return formatBooksResponse(results, `title '${params.title}'`);
    }
  );

  server.registerTool(
    "get_books_by_isbn_list",
    {
      title: "Get Books by ISBN List",
      description: `Look up multiple books by a list of ISBNs. Returns full details for each book found.

Args:
  - isbns (string[]): Array of ISBNs to look up (max 50)

Returns:
  Array of book objects found. Books not found are silently omitted.`,
      inputSchema: GetBooksByIsbnListSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetBooksByIsbnListInput) => {
      const results = getBooksByIsbns(params.isbns);
      return formatBooksResponse(results, `${params.isbns.length} ISBN(s)`);
    }
  );

  server.registerTool(
    "get_books_by_titles",
    {
      title: "Get Books by Titles",
      description: `Search for books matching any of the given title strings (case-insensitive partial match). Returns full details for all matching books.

Args:
  - titles (string[]): Array of titles (or partial titles) to search for (max 50)

Returns:
  Array of matching book objects with ISBN, title, author, date, and summary.`,
      inputSchema: GetBooksByTitlesSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetBooksByTitlesInput) => {
      const results = searchBooksByTitles(params.titles);
      return formatBooksResponse(results, `${params.titles.length} title(s)`);
    }
  );
}
