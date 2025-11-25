import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/evals/route';
import { POST as POST_REPORT } from '@/app/api/evals/report/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    evalRun: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    company: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/evals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return eval runs for authenticated user', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockEvalRuns = [
        {
          id: 'eval-1',
          suite: 'agent-eval',
          passRate: 0.95,
          totalTests: 100,
          passedTests: 95,
          company: { id: 'company-1', name: 'Acme' },
        },
      ];

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.evalRun.findMany).mockResolvedValue(mockEvalRuns as any);

      const request = {
        url: 'http://localhost/api/evals',
      } as NextRequest;
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.evalRuns).toHaveLength(1);
      expect(data.evalRuns[0].passRate).toBe(0.95);
    });
  });

  describe('POST', () => {
    it('should create eval run', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockCompany = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org-1',
      };

      const mockEvalRun = {
        id: 'eval-1',
        suite: 'agent-eval',
        passRate: 0.95,
        totalTests: 100,
        passedTests: 95,
        organizationId: 'org-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.company.findFirst).mockResolvedValue(mockCompany as any);
      vi.mocked(prisma.evalRun.create).mockResolvedValue(mockEvalRun as any);

      const body = {
        companyId: '550e8400-e29b-41d4-a716-446655440000',
        suite: 'agent-eval',
        passRate: 0.95,
        totalTests: 100,
        passedTests: 95,
      };

      const request = {
        json: async () => body,
      } as any;

      const response = await POST(request as NextRequest);
      expect(response.status).toBe(201);
    });
  });
});

describe('/api/evals/report', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept webhook payload and create eval run', async () => {
    const mockCompany = {
      id: 'company-1',
      organizationId: 'org-1',
    };

    const mockEvalRun = {
      id: 'eval-1',
      suite: 'agent-eval',
      trigger: 'webhook',
    };

    vi.mocked(prisma.company.findUnique).mockResolvedValue(mockCompany as any);
    vi.mocked(prisma.evalRun.create).mockResolvedValue(mockEvalRun as any);

      const body = {
        suite: 'agent-eval',
        passRate: 0.95,
        totalTests: 100,
        passedTests: 95,
        companyId: '550e8400-e29b-41d4-a716-446655440000',
      };

      const request = {
        json: async () => body,
      } as any;

      const response = await POST_REPORT(request as NextRequest);
      const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it('should return 400 when company not found', async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue(null);

      const body = {
        suite: 'agent-eval',
        passRate: 0.95,
        totalTests: 100,
        passedTests: 95,
        companyId: '550e8400-e29b-41d4-a716-446655440001', // Valid UUID but company doesn't exist
      };

      const request = {
        json: async () => body,
      } as any;

      const response = await POST_REPORT(request as NextRequest);
      expect(response.status).toBe(400);
  });
});

