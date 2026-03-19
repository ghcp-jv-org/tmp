// generated-by-copilot: Zod validation schemas for book-database MCP server tools

import { z } from "zod";

export const GetBookByIsbnSchema = z.object({
  isbn: z.string()
    .min(1, "ISBN is required")
    .describe("The ISBN of the book to look up")
}).strict();

export type GetBookByIsbnInput = z.infer<typeof GetBookByIsbnSchema>;

export const GetBookByTitleSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .describe("The title (or partial title) to search for, case-insensitive")
}).strict();

export type GetBookByTitleInput = z.infer<typeof GetBookByTitleSchema>;

export const GetBooksByIsbnListSchema = z.object({
  isbns: z.array(z.string().min(1))
    .min(1, "At least one ISBN is required")
    .max(50, "Maximum 50 ISBNs per request")
    .describe("Array of ISBNs to look up")
}).strict();

export type GetBooksByIsbnListInput = z.infer<typeof GetBooksByIsbnListSchema>;

export const GetBooksByTitlesSchema = z.object({
  titles: z.array(z.string().min(1))
    .min(1, "At least one title is required")
    .max(50, "Maximum 50 titles per request")
    .describe("Array of titles (or partial titles) to search for, case-insensitive")
}).strict();

export type GetBooksByTitlesInput = z.infer<typeof GetBooksByTitlesSchema>;
