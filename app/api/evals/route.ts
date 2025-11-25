import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-helpers";
import { z } from "zod";

const evalRunSchema = z.object({
  companyId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  suite: z.string().min(1),
  dataset: z.string().optional(),
  passRate: z.number().min(0).max(1),
  totalTests: z.number().int().positive(),
  passedTests: z.number().int().min(0),
  tokens: z.number().int().optional(),
  duration: z.number().int().optional(),
  trigger: z.enum(["manual", "scheduled", "webhook"]).optional(),
  payload: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const suite = searchParams.get("suite");

    const where: any = {
      organizationId: (user as any).organizationId,
    };

    if (companyId) {
      where.companyId = companyId;
    }

    if (suite) {
      where.suite = suite;
    }

    const evalRuns = await prisma.evalRun.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ evalRuns });
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
    const data = evalRunSchema.parse(body);

    // Verify company belongs to user's organization if provided
    if (data.companyId) {
      const company = await prisma.company.findFirst({
        where: {
          id: data.companyId,
          organizationId: (user as any).organizationId,
        },
      });

      if (!company) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }
    }

    const evalRun = await prisma.evalRun.create({
      data: {
        ...data,
        organizationId: (user as any).organizationId,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({ evalRun }, { status: 201 });
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

