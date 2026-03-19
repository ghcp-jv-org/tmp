# Seed Data Scenarios

## empty

Resets data files to empty arrays. Use for testing empty-state UI and error handling.

```json
// books.json
[]

// users.json
[]
```

## typical

Realistic data with a mix of genres, authors, and user activity. Books have varied years (1950-2024). Users have 0-5 favorites each. Use for feature development and demos.

## edge-cases

Tests boundary conditions and unusual input:

- **Books**: Titles with special characters (`O'Reilly`, `C++`, `"Quoted"`), very long titles (200+ chars), single-character titles, year at boundaries (1900, 2025), empty descriptions, ISBNs with leading zeros
- **Users**: Usernames at max length (30 chars), email with subdomains (`user@sub.domain.com`), users with 0 favorites, users with all books as favorites, duplicate-looking usernames (`john` vs `john1`)
- **Referential integrity**: Some `favorites` entries reference non-existent book IDs (tests error handling)

## stress-test

High-volume data for performance testing:

- 100+ books with randomized fields
- 50+ users with randomized favorites (up to 20 each)
- Tests pagination, search performance, and memory usage
- Includes duplicate authors and books with identical titles (different IDs)