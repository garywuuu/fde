# Testing Guide

## Test Structure

Tests are organized in the `test/` directory mirroring the source structure:

- `test/api/` - API route tests
- `test/components/` - Component tests
- `test/lib/` - Utility function tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test:coverage
```

## Test Coverage

Current test coverage includes:

### API Routes (8 test files, 32 tests)
- ✅ `/api/customers` - CRUD operations
- ✅ `/api/integrations` - Integration management
- ✅ `/api/tasks` - Task management with filtering
- ✅ `/api/notes` - Notes with versioning
- ✅ `/api/evals` - Eval runs and webhook ingestion

### Components (2 test files, 11 tests)
- ✅ `Button` - Variants, sizes, interactions
- ✅ `Card` - Rendering and props

### Utilities (1 test file, 3 tests)
- ✅ `auth-helpers` - Authentication utilities

## Writing New Tests

### API Route Test Example

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/your-route/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    yourModel: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/your-route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle GET requests', async () => {
    // Test implementation
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from '@/components/YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Mock external dependencies** - Always mock Prisma, NextAuth, and other external services
2. **Use valid UUIDs** - When testing with UUID fields, use valid UUID format
3. **Test error cases** - Include tests for 400, 401, 404, and 500 responses
4. **Clean up mocks** - Use `beforeEach` to reset mocks between tests
5. **Test user flows** - Test complete user workflows, not just individual functions

