# @project-42/shared-utils

Shared utility functions for Project 42 applications.

## Purpose

This package contains common utility functions that are used across both:
- **Galion Initiative** 
- **The Machine**

## Usage

Import utilities from this package:

```typescript
import { isValidEmail, formatDate, truncate } from '@project-42/shared-utils';

// Validate email
const valid = isValidEmail('user@example.com');

// Format date
const formatted = formatDate(new Date());

// Truncate text
const short = truncate('Very long text...', 50);
```

## Utilities

- `isValidEmail()` - Email validation
- `formatDate()` - Date formatting
- `truncate()` - Text truncation
- `sleep()` - Async delay
- `safeJsonParse()` - Safe JSON parsing

## Guidelines

When adding utilities:

1. **Keep them pure** - No side effects
2. **Make them reusable** - Solve general problems
3. **Type them strictly** - Use TypeScript
4. **Document clearly** - Add JSDoc comments
5. **Test thoroughly** - Ensure reliability

---

*Part of Project 42*
