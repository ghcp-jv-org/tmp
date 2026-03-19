---
name: 'React Component Standards'
description: 'Enforces functional components with hooks, Redux Toolkit integration, CSS Modules, and authentication checks'
applyTo: '**/*.jsx'
---

# React Component Standards

## Component Architecture
- Use **functional components with hooks only** — no class components
- Import order: React → third-party libraries → local components → CSS Modules
- Destructure props in the function signature with defaults: `function MyComponent({ prop1 = 'default', prop2 })`

## State Management
- Use **Redux Toolkit slices** in `frontend/src/store/` for shared application state
- Use `useState` only for local UI state (dropdowns, form inputs, temporary values)
- Import typed hooks from `../store/hooks` (defined as `useAppDispatch` and `useAppSelector`)

## Redux Hooks Pattern
Always use pre-typed Redux hooks to ensure type safety:
```jsx
// ❌ BAD
import { useDispatch, useSelector } from 'react-redux'
const dispatch = useDispatch()
const count = useSelector((state) => state.counter.value)

// ✅ GOOD
import { useAppDispatch, useAppSelector } from '../store/hooks'
const dispatch = useAppDispatch()
const count = useAppSelector((state) => state.counter.value)
```

## Styling
- Use **CSS Modules** for all component styles
- Import as: `import styles from '../styles/ComponentName.module.css'`
- Reference classes as `styles.className` in JSX

## Authentication
- Always check for auth token before dispatching API calls that require authentication
- Redirect to login page if token is missing
- Example: `if (!token) { navigate('/login'); return; }`

## Summary
Enforce functional components, typed Redux hooks from the custom hooks file, CSS Modules for styling, proper import order, and token validation before authenticated operations.
