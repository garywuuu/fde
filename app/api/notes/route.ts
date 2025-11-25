import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const noteSchema = z.object({
  customerId: z.string().uuid().optional(),
  title: z.string().min(1),
  content: z.string(),
  type: z.enum(["note", "proposal", "update", "meeting"]).optional(),
  template: z.string().optional(),
  clientVisible: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const type = searchParams.get("type");

    const where: any = {
      author: {
        organizationId: (user as any).organizationId,
      },
    };

    if (customerId) {
      where.customerId = customerId;
    }

    if (type) {
      where.type = type;
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ notes });
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

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const data = noteSchema.parse(body);

    // Generate shareable link
    const shareableLink = `note-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const createData: any = {
      title: data.title,
      content: data.content,
      authorId: user.id,
      shareableLink,
    };
    
    if (data.type) createData.type = data.type;
    if (data.clientVisible !== undefined) createData.clientVisible = data.clientVisible;
    if (data.customerId) createData.customerId = data.customerId;

    const note = await prisma.note.create({
      data: createData,
      include: {
        customer: true,
        author: true,
      },
    });

    return NextResponse.json({ note }, { status: 201 });
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

