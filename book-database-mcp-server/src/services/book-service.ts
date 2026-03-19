// generated-by-copilot: Book data service — loads and queries the local JSON catalog

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { Book, BookDetails, BookDetailsFile, BookWithDetails } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const booksPath = join(__dirname, "..", "data", "books.json");
const detailsPath = join(__dirname, "..", "data", "books-details.json");

// generated-by-copilot: Load catalog data once at startup
const books: Book[] = JSON.parse(readFileSync(booksPath, "utf-8"));
const detailsFile: BookDetailsFile = JSON.parse(readFileSync(detailsPath, "utf-8"));
const detailsMap = new Map<string, BookDetails>(
  detailsFile.books.map((d) => [d.ISBN, d])
);

function mergeBookWithDetails(book: Book): BookWithDetails {
  const details = detailsMap.get(book.ISBN);
  return {
    ISBN: book.ISBN,
    title: book.title,
    author: book.author,
    summary: details?.summary,
    date: details?.date,
  };
}

export function getBookByIsbn(isbn: string): BookWithDetails | undefined {
  const book = books.find((b) => b.ISBN === isbn);
  return book ? mergeBookWithDetails(book) : undefined;
}

export function searchBooksByTitle(title: string): BookWithDetails[] {
  const lower = title.toLowerCase();
  return books
    .filter((b) => b.title.toLowerCase().includes(lower))
    .map(mergeBookWithDetails);
}

export function getBooksByIsbns(isbns: string[]): BookWithDetails[] {
  const isbnSet = new Set(isbns);
  return books
    .filter((b) => isbnSet.has(b.ISBN))
    .map(mergeBookWithDetails);
}

export function searchBooksByTitles(titles: string[]): BookWithDetails[] {
  const lowerTitles = titles.map((t) => t.toLowerCase());
  return books
    .filter((b) => {
      const titleLower = b.title.toLowerCase();
      return lowerTitles.some((t) => titleLower.includes(t));
    })
    .map(mergeBookWithDetails);
}
