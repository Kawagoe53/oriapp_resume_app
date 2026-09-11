const configuredMonthlyLimit = Number.parseInt(
  process.env.AI_USAGE_MONTHLY_LIMIT ?? "5",
  10,
);

export const AI_USAGE_MONTHLY_LIMIT =
  Number.isFinite(configuredMonthlyLimit) && configuredMonthlyLimit > 0
    ? configuredMonthlyLimit
    : 5;

export const getAiUsagePeriod = (now = new Date()) => {
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextPeriodStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { periodStart, nextPeriodStart };
};
