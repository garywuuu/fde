import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["open", "in_progress", "completed", "blocked"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    const task = await prisma.task.findFirst({
      where: {
        id: id,
        owner: {
          organizationId: (user as any).organizationId,
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updated = await prisma.task.update({
      where: { id: id },
      data,
      include: {
        company: true,
        integration: true,
        owner: true,
      },
    });

    return NextResponse.json({ task: updated });
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

