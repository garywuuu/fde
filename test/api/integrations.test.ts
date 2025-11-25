import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/integrations/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    integration: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    company: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/integrations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return integrations for authenticated user', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockIntegrations = [
        {
          id: 'integration-1',
          name: 'Customer API',
          status: 'pilot',
          company: { id: 'company-1', name: 'Acme' },
          owner: { id: 'user-1', name: 'John' },
          _count: { checklistItems: 5, artifactLinks: 2, tasks: 3 },
        },
      ];

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.integration.findMany).mockResolvedValue(mockIntegrations as any);

      const request = {
        url: 'http://localhost/api/integrations',
      } as NextRequest;
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.integrations).toHaveLength(1);
      expect(data.integrations[0].name).toBe('Customer API');
    });

    it('should filter by companyId when provided', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.integration.findMany).mockResolvedValue([]);

      const request = {
        url: 'http://localhost/api/integrations?companyId=company-1',
      } as NextRequest;
      
      await GET(request);

      expect(prisma.integration.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-1',
          companyId: 'company-1',
        },
        include: expect.any(Object),
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('POST', () => {
    it('should create integration when company exists', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockCompany = {
        id: companyId,
        organizationId: 'org-1',
      };

      const mockIntegration = {
        id: 'integration-1',
        name: 'New Integration',
        companyId: companyId,
        organizationId: 'org-1',
        ownerId: 'user-1',
        company: mockCompany,
        owner: mockUser,
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.company.findFirst).mockResolvedValue(mockCompany as any);
      vi.mocked(prisma.integration.create).mockResolvedValue(mockIntegration as any);

      const body = {
        companyId: companyId,
        name: 'New Integration',
        status: 'discovery' as const,
      };

      const request = {
        json: async () => body,
      } as any;

      const response = await POST(request as NextRequest);
      expect(response.status).toBe(201);
    });

    it('should return 404 when company not found', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.company.findFirst).mockResolvedValue(null);

      // Use a valid UUID format to pass validation
      const validUUID = '550e8400-e29b-41d4-a716-446655440001'; // Different UUID for not found case
      
      const body = {
        companyId: validUUID,
        name: 'New Integration',
        status: 'discovery' as const,
      };

      const request = {
        json: async () => body,
      } as any;

      const response = await POST(request as NextRequest);
      const data = await response.json();
      // The API returns 404 when company is not found (after validation passes)
      expect(response.status).toBe(404);
      expect(data.error).toBe('Company not found');
    });
  });
});

