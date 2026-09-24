import { z } from "zod";

export const MIN_JOB_EXPERIENCES = 1;
export const MAX_JOB_EXPERIENCES = 3;

const requiredText = z.string().trim().min(1, "入力してください");
const dateText = z.iso.date("日付をYYYY-MM-DD形式で入力してください");

const jobExperienceSchema = z.object({
  companyName: requiredText,
  position: requiredText,
  jobType: requiredText,
  startDate: dateText,
  endDate: z.union([dateText, z.literal("")]),
  description: z.array(
    z.object({
      value: z.string(),
    }),
  ),
});

// The API receives descriptions as strings, while the form uses field-array objects.
export const jobExperiencesUpdateSchema = z.array(jobExperienceSchema.extend({
  description: z.array(z.string()),
  endDate: z.union([dateText, z.literal("")]).nullable().optional(),
})).min(MIN_JOB_EXPERIENCES, "職歴は最低1件必要です")
  .max(MAX_JOB_EXPERIENCES, "職歴は最大3件までです");

export const resumeEditSchema = z.object({
  fullName: z.string(),
  email: z.string().email("Invalid email"),
  phone: z.string(),
  address: z.string(),
  visaInfo: z.string(),
  availability: z.string(),

  summary: z.string(),

  educationSchool: z.string(),
  educationMajor: z.string(),
  educationYear: z.string(),

  skills: z.array(
    z.object({
      value: z.string(),
    }),
  ),

  certificate: z.array(
    z.object({
      value: z.string(),
    }),
  ),

  jobExperiences: z.array(jobExperienceSchema)
    .min(MIN_JOB_EXPERIENCES, "職歴は最低1件必要です")
    .max(MAX_JOB_EXPERIENCES, "職歴は最大3件までです"),
});

export type ResumeEditFormData = z.infer<typeof resumeEditSchema>;
