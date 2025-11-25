import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const integrationSchema = z.object({
  customerId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  name: z.string().min(1),
  status: z.enum(["discovery", "build", "pilot", "launch"]).optional(),
  phase: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const where: any = {
      organizationId: (user as any).organizationId,
    };

    if (customerId) {
      where.customerId = customerId;
    }

    const integrations = await prisma.integration.findMany({
      where,
      include: {
        customer: {
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
          },
        },
        _count: {
          select: {
            checklistItems: true,
            artifactLinks: true,
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ integrations });
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
    const data = integrationSchema.parse(body);

    // Verify customer belongs to user's organization
    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        organizationId: (user as any).organizationId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const integration = await prisma.integration.create({
      data: {
        ...data,
        organizationId: (user as any).organizationId,
        ownerId: user.id,
      },
      include: {
        customer: true,
        owner: true,
        template: true,
      },
    });

    return NextResponse.json({ integration }, { status: 201 });
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

