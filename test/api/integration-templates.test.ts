import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/integrations/templates/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    integrationTemplate: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/integrations/templates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return templates for authenticated user', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockTemplates = [
        {
          id: 'template-1',
          name: 'API Integration',
          description: 'Standard API integration template',
          checklistItems: [],
          _count: { checklistItems: 5 },
        },
      ];

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.integrationTemplate.findMany).mockResolvedValue(mockTemplates as any);

      const request = {
        url: 'http://localhost/api/integrations/templates',
      } as NextRequest;

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.templates).toHaveLength(1);
      expect(data.templates[0].name).toBe('API Integration');
    });
  });

  describe('POST', () => {
    it('should create template with checklist items', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockTemplate = {
        id: 'template-1',
        name: 'New Template',
        organizationId: 'org-1',
        checklistItems: [
          { id: 'item-1', title: 'Item 1' },
        ],
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.integrationTemplate.create).mockResolvedValue(mockTemplate as any);

      const body = {
        name: 'New Template',
        description: 'Template description',
        checklistItems: [
          { title: 'Item 1', description: 'Description 1' },
        ],
      };

      const request = {
        json: async () => body,
      } as any;

      const response = await POST(request as NextRequest);
      expect(response.status).toBe(201);
    });
  });
});

