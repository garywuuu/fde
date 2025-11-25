import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Webhook endpoint for external eval systems (Helicone, Langfuse, etc.)
const webhookSchema = z.object({
  suite: z.string().min(1),
  dataset: z.string().optional(),
  passRate: z.number().min(0).max(1),
  totalTests: z.number().int().positive(),
  passedTests: z.number().int().min(0),
  tokens: z.number().int().optional(),
  duration: z.number().int().optional(),
  companyId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
  payload: z.record(z.any()).optional(),
  // Optional webhook auth token
  token: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = webhookSchema.parse(body);

    // TODO: Verify webhook token if configured
    // For now, accept all webhooks (should be secured in production)

    // Try to find organization by companyId or use a default
    let organizationId: string | undefined;

    if (data.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: data.companyId },
        select: { organizationId: true },
      });
      if (company) {
        organizationId = company.organizationId;
      }
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization not found. Provide valid companyId." },
        { status: 400 }
      );
    }

    const evalRun = await prisma.evalRun.create({
      data: {
        suite: data.suite,
        dataset: data.dataset,
        passRate: data.passRate,
        totalTests: data.totalTests,
        passedTests: data.passedTests,
        tokens: data.tokens,
        duration: data.duration,
        trigger: "webhook",
        companyId: data.companyId,
        agentId: data.agentId,
        payload: data.payload as any,
        metadata: data.metadata as any,
        organizationId,
      },
    });

    return NextResponse.json({ success: true, evalRun }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid webhook payload", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

