import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/tasks/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return tasks filtered by status', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockTasks = [
        {
          id: 'task-1',
          title: 'Test Task',
          status: 'open',
          priority: 'high',
          owner: { id: 'user-1', name: 'John' },
        },
      ];

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any);

      const request = new NextRequest('http://localhost/api/tasks?status=open');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toHaveLength(1);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          owner: { organizationId: 'org-1' },
          status: 'open',
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return all tasks when no filter', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.task.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/tasks');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          owner: { organizationId: 'org-1' },
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('POST', () => {
    it('should create a new task', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockTask = {
        id: 'task-1',
        title: 'New Task',
        status: 'open',
        priority: 'medium',
        ownerId: 'user-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.task.create).mockResolvedValue(mockTask as any);

      const request = new NextRequest('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Task',
          status: 'open',
          priority: 'medium',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.task.title).toBe('New Task');
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          status: 'open',
          priority: 'medium',
          ownerId: 'user-1',
          dueDate: undefined,
        },
        include: expect.any(Object),
      });
    });
  });
});

