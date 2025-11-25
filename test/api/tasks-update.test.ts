import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { PATCH } from '@/app/api/tasks/[id]/patch/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/tasks/[id]/patch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update task status', async () => {
    const mockUser = {
      id: 'user-1',
      organizationId: 'org-1',
    };

    const mockTask = {
      id: 'task-1',
      status: 'open',
      owner: { organizationId: 'org-1' },
    };

    const updatedTask = {
      ...mockTask,
      status: 'completed',
    };

    vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.task.findFirst).mockResolvedValue(mockTask as any);
    vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any);

    const body = {
      status: 'completed' as const,
    };

    const request = {
      json: async () => body,
    } as any;

    const response = await PATCH(request as NextRequest, { params: { id: 'task-1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.task.status).toBe('completed');
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { status: 'completed' },
      include: expect.any(Object),
    });
  });

  it('should return 404 when task not found', async () => {
    const mockUser = {
      id: 'user-1',
      organizationId: 'org-1',
    };

    vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.task.findFirst).mockResolvedValue(null);

    const body = {
      status: 'completed' as const,
    };

    const request = {
      json: async () => body,
    } as any;

    const response = await PATCH(request as NextRequest, { params: { id: 'invalid-task' } });
    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid status', async () => {
    const mockUser = {
      id: 'user-1',
      organizationId: 'org-1',
    };

    vi.mocked(requireAuth).mockResolvedValue(mockUser as any);

    const body = {
      status: 'invalid-status' as any,
    };

    const request = {
      json: async () => body,
    } as any;

    const response = await PATCH(request as NextRequest, { params: { id: 'task-1' } });
    expect(response.status).toBe(400);
  });
});

