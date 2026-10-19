import { z } from "zod";
import { JobType } from "@/app/generated/prisma/enums";

export const MAX_RESUME_TITLE_LENGTH = 50;

export const optionalResumeTitleSchema = z.string().trim()
  .max(MAX_RESUME_TITLE_LENGTH, "タイトルは50文字以内で入力してください");

export const resumeTitleSchema = optionalResumeTitleSchema
  .min(1, "タイトルを入力してください");

export const createResumeSchema = z.object({
  resume: z.object({
    jobType: z.enum(JobType, { error: "業種を選択してください" }),
    title: optionalResumeTitleSchema.optional(),
  }),
});
