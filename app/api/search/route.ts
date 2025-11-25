import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const organizationId = (user as any).organizationId;

    // Search across multiple entities
    const [customers, integrations, tasks, notes] = await Promise.all([
      prisma.customer.findMany({
        where: {
          organizationId,
          name: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          stage: true,
        },
      }),
      prisma.integration.findMany({
        where: {
          organizationId,
          name: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          status: true,
        },
      }),
      prisma.task.findMany({
        where: {
          owner: { organizationId },
          title: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
        },
      }),
      prisma.note.findMany({
        where: {
          author: { organizationId },
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
        },
      }),
    ]);

    return NextResponse.json({
      results: {
        customers,
        integrations,
        tasks,
        notes,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

