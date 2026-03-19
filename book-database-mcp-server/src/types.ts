// generated-by-copilot: TypeScript type definitions for book catalog data

export interface Book {
  ISBN: string;
  title: string;
  author: string;
}

export interface BookDetails {
  ISBN: string;
  summary: string;
  date: string;
  author: string;
}

export interface BookDetailsFile {
  books: BookDetails[];
}

export interface BookWithDetails {
  ISBN: string;
  title: string;
  author: string;
  summary?: string;
  date?: string;
}
