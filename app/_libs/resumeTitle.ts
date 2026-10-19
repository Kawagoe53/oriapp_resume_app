import type { JobType } from "@/app/generated/prisma/enums";

export function getDefaultResumeTitle(jobType: JobType): string {
  const titles: Record<JobType, string> = {
    CAFE: "カフェ用の履歴書",
    FARM: "農場用の履歴書",
    HOTEL: "ホテル用の履歴書",
  };
  return titles[jobType];
}
