import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/customers/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/customers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return customers for authenticated user', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockCustomers = [
        {
          id: 'customer-1',
          name: 'Acme Corp',
          stage: 'live',
          organizationId: 'org-1',
          owner: { id: 'user-1', name: 'John', email: 'john@example.com' },
          _count: { integrations: 2, tasks: 5 },
        },
      ];

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.customer.findMany).mockResolvedValue(mockCustomers as any);

      const request = new NextRequest('http://localhost/api/customers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.customers).toHaveLength(1);
      expect(data.customers[0].name).toBe('Acme Corp');
      expect(prisma.customer.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
        include: expect.any(Object),
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should return 401 when not authenticated', async () => {
      vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

      const request = new NextRequest('http://localhost/api/customers');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe('POST', () => {
    it('should create a new customer', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockCustomer = {
        id: 'customer-1',
        name: 'New Customer',
        stage: 'discovery',
        organizationId: 'org-1',
        ownerId: 'user-1',
        owner: { id: 'user-1', name: 'John', email: 'john@example.com' },
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.customer.create).mockResolvedValue(mockCustomer as any);

      const request = new NextRequest('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Customer',
          stage: 'discovery',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.customer.name).toBe('New Customer');
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          name: 'New Customer',
          stage: 'discovery',
          organizationId: 'org-1',
          ownerId: 'user-1',
        },
        include: expect.any(Object),
      });
    });

    it('should return 400 for invalid input', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);

      const request = new NextRequest('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: '', // Invalid: empty name
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});

