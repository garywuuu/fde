import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(["discovery", "build", "pilot", "launch"]).optional(),
  phase: z.string().optional(),
  ownerId: z.string().uuid().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const integration = await prisma.integration.findFirst({
      where: {
        id: id,
        organizationId: (user as any).organizationId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            checklistItems: true,
          },
        },
        checklistItems: {
          orderBy: {
            createdAt: "asc",
          },
        },
        artifactLinks: {
          orderBy: {
            createdAt: "desc",
          },
        },
        tasks: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    return NextResponse.json({ integration });
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

    const integration = await prisma.integration.findFirst({
      where: {
        id: id,
        organizationId: (user as any).organizationId,
      },
    });

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    const updated = await prisma.integration.update({
      where: { id: id },
      data,
      include: {
        company: true,
        owner: true,
      },
    });

    return NextResponse.json({ integration: updated });
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

    const integration = await prisma.integration.findFirst({
      where: {
        id: id,
        organizationId: (user as any).organizationId,
      },
    });

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    await prisma.integration.delete({
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

