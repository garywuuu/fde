import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/notes/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    note: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-helpers', () => ({
  requireAuth: vi.fn(),
  unauthorizedResponse: vi.fn(() => new Response(null, { status: 401 })),
}));

describe('/api/notes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return notes for authenticated user', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockNotes = [
        {
          id: 'note-1',
          title: 'Meeting Notes',
          content: 'Discussion about integration',
          type: 'meeting',
          customer: { id: 'customer-1', name: 'Acme' },
          author: { id: 'user-1', name: 'John' },
        },
      ];

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.note.findMany).mockResolvedValue(mockNotes as any);

      const request = new NextRequest('http://localhost/api/notes');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.notes).toHaveLength(1);
      expect(data.notes[0].title).toBe('Meeting Notes');
    });

    it('should filter by customerId when provided', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.note.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/notes?customerId=customer-1');
      await GET(request);

      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: {
          author: { organizationId: 'org-1' },
          customerId: 'customer-1',
        },
        include: expect.any(Object),
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('POST', () => {
    it('should create note with shareable link', async () => {
      const mockUser = {
        id: 'user-1',
        organizationId: 'org-1',
      };

      const mockNote = {
        id: 'note-1',
        title: 'New Note',
        content: 'Note content',
        shareableLink: 'note-123456',
        authorId: 'user-1',
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.note.create).mockResolvedValue(mockNote as any);

      const request = new NextRequest('http://localhost/api/notes', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Note',
          content: 'Note content',
          type: 'note',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.note.title).toBe('New Note');
      expect(prisma.note.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'New Note',
          content: 'Note content',
          authorId: 'user-1',
          shareableLink: expect.any(String),
        }),
        include: expect.any(Object),
      });
    });
  });
});

