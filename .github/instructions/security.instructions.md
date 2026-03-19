---
name: 'Security Standards'
description: 'OWASP-aligned security conventions for all JavaScript and JSX files'
applyTo: '**/*.{js,jsx}'
---

# Security Standards

## Input Validation
- Validate all route parameters, query strings, and request body fields before processing
- Use allowlists for expected values; reject unexpected input with 400 status
- Never trust client-side validation alone - always validate server-side

## Forbidden Patterns
- Never use `eval()`, `Function()`, `setTimeout(string)`, or any dynamic code execution
- Never hardcode secrets, API keys, or credentials in source code - use environment variables
- Never expose stack traces or internal error details in API responses

## Injection Prevention
- Use parameterized queries for any database operations
- Sanitize user input before inserting into HTML or database queries
- Escape special characters in user-provided data used in file paths or shell commands

## XSS Prevention
- Sanitize all user input before rendering in the browser
- Use React's built-in JSX escaping - never use `dangerouslySetInnerHTML` with unsanitized data
- Validate and sanitize URL parameters before using in redirects

## CORS & Rate Limiting
- Never use wildcard `*` for CORS `Access-Control-Allow-Origin` in production
- Configure CORS to allow only known frontend origins
- Apply rate limiting on authentication endpoints (`/api/auth/login`, `/api/auth/register`)
