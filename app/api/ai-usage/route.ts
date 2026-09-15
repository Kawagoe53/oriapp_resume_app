import { AI_USAGE_MONTHLY_LIMIT, getAiUsagePeriod } from "@/app/_libs/aiUsage";
import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export type AiUsageResponse = {
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
  createdDates: string[];
};

export const GET = async (request: NextRequest) => {
  try {
    const userId = await getUserId(request);
    const { periodStart, nextPeriodStart } = getAiUsagePeriod();
    const usages = await prisma.aiUsage.findMany({
      where: {
        userId,
        createdAt: { gte: periodStart },
      },
      select: {
        createdAt: true,
      },
    });

    const used = usages.length;

    return NextResponse.json<AiUsageResponse>({
      used,
      limit: AI_USAGE_MONTHLY_LIMIT,
      remaining: Math.max(AI_USAGE_MONTHLY_LIMIT - used, 0),
      resetAt: nextPeriodStart.toISOString(),
      createdDates: usages.map((usage) => usage.createdAt.toISOString()), //usages の各使用履歴から、createdAt だけを取り出して配列にする
    });
  } catch (error) {
    return buildError(error);
  }
};
