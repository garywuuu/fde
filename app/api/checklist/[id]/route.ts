import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const updateSchema = z.object({
  state: z.enum(["pending", "in_progress", "completed", "blocked"]).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await requireAuth();
    const body = await req.json();
    const data = updateSchema.parse(body);

    // Verify checklist item belongs to user's organization
    const item = await prisma.checklistItem.findFirst({
      where: {
        id: id,
        integration: {
          organizationId: (user as any).organizationId,
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 });
    }

    const updated = await prisma.checklistItem.update({
      where: { id: id },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      },
    });

    return NextResponse.json({ item: updated });
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

    const item = await prisma.checklistItem.findFirst({
      where: {
        id: id,
        integration: {
          organizationId: (user as any).organizationId,
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 });
    }

    await prisma.checklistItem.delete({
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

