---
name: CSS Module Standards
description: Enforce consistent CSS Modules conventions for locally scoped, maintainable styling with kebab-case naming, CSS custom properties, and mobile-first responsive design.
applyTo: '**/*.module.css'
---

# CSS Module Standards

CSS Modules provide local scoping by default. Use these conventions to maintain consistency across the codebase.

## Naming Conventions
- Use **kebab-case** for all class names (e.g., `.book-card`, `.nav-header`, `.button-primary`)
- Import styles as `styles` object and apply via `className={styles.bookCard}`
- Class names map to unique global names at compile time

## CSS Properties & Values
- Never use `!important`
- Use **CSS custom properties** (variables) defined in `App.module.css` for colors and spacing
- Example: `color: var(--color-primary); padding: var(--spacing-md);`

## Responsive Design
- Use **mobile-first** approach with `min-width` media queries
- Example: `@media (min-width: 768px) { /* tablet and above */ }`
- Define base styles for mobile, enhance for larger screens

## Selector Structure
- Keep selectors **flat** with maximum 2 levels of nesting
- Avoid deep nesting that reduces readability and performance

## Example

**Good:**
```css
.book-card {
  padding: var(--spacing-md);
  background: var(--color-background);
}

.book-card-title {
  font-size: 1.2rem;
  color: var(--color-primary);
}

@media (min-width: 768px) {
  .book-card {
    padding: var(--spacing-lg);
  }
}
```

**Bad:**
```css
.bookCard {
  padding: 16px !important;
  background: #f5f5f5;
}

.book-card .title .inner span {
  font-size: 1.2rem;
  color: #007bff;
}
```
