import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  stage: z.enum(["discovery", "pilot", "rollout", "live"]).optional(),
  successMetrics: z.record(z.any()).optional(),
  ownerId: z.string().uuid().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const company = await prisma.company.findFirst({
      where: {
        id: id,
        organizationId: (user as any).organizationId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        integrations: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                checklistItems: true,
                tasks: true,
              },
            },
          },
        },
        tasks: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        notes: {
          take: 10,
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            integrations: true,
            tasks: true,
            notes: true,
            pipelines: true,
            agents: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    const company = await prisma.company.findFirst({
      where: {
        id: id,
        organizationId: (user as any).organizationId,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const updated = await prisma.company.update({
      where: { id: id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ company: updated });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const company = await prisma.company.findFirst({
      where: {
        id: id,
        organizationId: (user as any).organizationId,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    await prisma.company.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
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

