---
applyTo: '**/*.jsx'
---

# React Component Conventions

## Core Patterns
- **Functional components only**: Use hooks exclusively (useState, useEffect, useContext). Never use class components.
- **Import order**: React → third-party libraries → local components → styles
- **Props destructuring**: Always destructure props in function signature with default values provided for each prop that needs one.

## State Management
- **Redux Toolkit slices**: Use Redux Toolkit slices in `frontend/src/store/` for shared state (user data, book lists, etc.)
- **Local state only**: Use `useState` only for temporary UI state (dropdown toggles, form inputs, loading spinners)
- **Custom hooks**: Import `useAppDispatch` and `useAppSelector` from `../store/hooks` instead of raw `useDispatch`/`useSelector` from react-redux to ensure proper typing and consistency

## Styling & Authentication
- **CSS Modules**: Import styles as `import styles from '../styles/ComponentName.module.css'` and reference classes as `styles.className`
- **Token check**: Always check for auth token before dispatching authenticated API calls. Redirect to login if missing:
  ```jsx
  const token = useAppSelector(state => state.auth.token);
  if (!token) {
    navigate('/login');
    return;
  }
  dispatch(fetchBooks());
  ```

## Redux Hooks Example
**❌ BAD** – Raw react-redux hooks, breaks type safety:
```jsx
import { useDispatch, useSelector } from 'react-redux';
const dispatch = useDispatch();
const books = useSelector(state => state.books);
```

**✅ GOOD** – Pre-typed custom hooks from store:
```jsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
const dispatch = useAppDispatch();
const books = useAppSelector(state => state.books.items);
```
