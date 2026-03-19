#!/usr/bin/env node
// generated-by-copilot: seed data generator for Book Favorites app
// Usage: node seed-data.js --volume <small|medium|large> --scenario <empty|typical|edge-cases|stress-test>

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const volumeIdx = args.indexOf('--volume');
const scenarioIdx = args.indexOf('--scenario');
const volume = volumeIdx !== -1 ? args[volumeIdx + 1] : 'medium';
const scenario = scenarioIdx !== -1 ? args[scenarioIdx + 1] : 'typical';

const VOLUMES = { small: { books: 5, users: 3 }, medium: { books: 25, users: 10 }, large: { books: 100, users: 50 } };
const counts = VOLUMES[volume] || VOLUMES.medium;

// generated-by-copilot: sample data pools
const AUTHORS = ['Harper Lee', 'George Orwell', 'Jane Austen', 'F. Scott Fitzgerald', 'J.R.R. Tolkien', 'Agatha Christie', 'Mark Twain', 'Virginia Woolf', 'Ernest Hemingway', 'Toni Morrison'];
const TITLES = ['The Great Adventure', 'Silent Echoes', 'Midnight Garden', 'The Last Chapter', 'Burning Bridges', 'Ocean\'s Edge', 'Starlight Path', 'Forgotten Realms', 'The Iron Gate', 'Whispered Secrets'];
const EDGE_TITLES = ["O'Reilly's Guide to C++", '"Quoted Title"', 'A', 'x'.repeat(200), '日本語タイトル', '<script>alert(1)</script>'];

function generateId() { return crypto.randomBytes(8).toString('hex'); }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomItem(arr) { return arr[randomInt(0, arr.length - 1)]; }
function generateIsbn() { return String(randomInt(1000000000000, 9999999999999)); }

function generateBooks(count, useEdgeCases) {
  const books = [];
  const titlePool = useEdgeCases ? [...TITLES, ...EDGE_TITLES] : TITLES;
  for (let i = 0; i < count; i++) {
    books.push({
      id: generateId(),
      title: useEdgeCases && i < EDGE_TITLES.length ? EDGE_TITLES[i] : `${randomItem(titlePool)} ${i + 1}`,
      author: randomItem(AUTHORS),
      isbn: generateIsbn(),
      year: useEdgeCases ? (i === 0 ? 1900 : i === 1 ? 2025 : randomInt(1950, 2024)) : randomInt(1950, 2024),
      description: `A compelling story by a renowned author. Volume ${i + 1}.`,
    });
  }
  return books;
}

function generateUsers(count, bookIds, useEdgeCases) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const maxFavs = useEdgeCases ? bookIds.length : Math.min(5, bookIds.length);
    const numFavs = randomInt(0, maxFavs);
    const shuffled = [...bookIds].sort(() => Math.random() - 0.5);
    const favorites = shuffled.slice(0, numFavs);
    // generated-by-copilot: add a broken reference for edge-case testing
    if (useEdgeCases && i === 0) favorites.push('nonexistent-book-id');
    users.push({
      id: generateId(),
      username: useEdgeCases && i === 0 ? 'a'.repeat(30) : `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: '$2b$10$placeholder.hash.for.seed.data.only',
      favorites,
    });
  }
  return users;
}

// generated-by-copilot: resolve data directory relative to workspace root
// Try cwd first, then fall back to locating copilot-agent-and-mcp relative to script location
let dataDir = path.resolve(process.cwd(), 'backend/data');
if (!fs.existsSync(dataDir)) {
  // generated-by-copilot: script lives at <root>/.github/skills/seeding-test-data/scripts/seed-data.js
  const rootDir = path.resolve(__dirname, '..', '..', '..', '..');
  dataDir = path.resolve(rootDir, 'copilot-agent-and-mcp', 'backend', 'data');
}
if (!fs.existsSync(dataDir)) { console.error(`Error: ${dataDir} not found. Run from the workspace root or copilot-agent-and-mcp/ directory.`); process.exit(1); }

let books, users;
if (scenario === 'empty') {
  books = [];
  users = [];
} else {
  const useEdge = scenario === 'edge-cases';
  books = generateBooks(counts.books, useEdge);
  users = generateUsers(counts.users, books.map((b) => b.id), useEdge);
}

fs.writeFileSync(path.join(dataDir, 'books.json'), JSON.stringify(books, null, 2));
fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
console.log(`Seeded ${books.length} books and ${users.length} users (${volume}/${scenario}) into ${dataDir}`);