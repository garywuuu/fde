import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  checklistItems: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    category: z.string().optional(),
  })).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const templates = await prisma.integrationTemplate.findMany({
      where: {
        organizationId: (user as any).organizationId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        checklistItems: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ templates });
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
    const data = templateSchema.parse(body);

    const template = await prisma.integrationTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId: (user as any).organizationId,
        checklistItems: data.checklistItems || [],
      },
    });

    return NextResponse.json({ template }, { status: 201 });
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

