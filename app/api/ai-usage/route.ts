import buildError from "@/app/_libs/buildError";
import {
  AI_USAGE_MONTHLY_LIMIT,
  getAiUsagePeriod,
} from "@/app/_libs/aiUsage";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export type AiUsageResponse = {
  used: number;
  limit: number;
  remaining: number;
  resetAt: Date;
};

export const GET = async (request: NextRequest) => {
  try {
    const userId = await getUserId(request);
    const { periodStart, nextPeriodStart } = getAiUsagePeriod();
    const used = await prisma.aiUsage.count({
      where: {
        userId,
        createdAt: { gte: periodStart },
      },
    });

    return NextResponse.json<AiUsageResponse>({
      used,
      limit: AI_USAGE_MONTHLY_LIMIT,
      remaining: Math.max(AI_USAGE_MONTHLY_LIMIT - used, 0),
      resetAt: nextPeriodStart,
    });
  } catch (error) {
    return buildError(error);
  }
};
