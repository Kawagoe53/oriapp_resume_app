import { z } from "zod";

export const jobExperienceSchema = z.object({
  companyName: z.string(),
  position: z.string(),
  jobType: z.string(),
  description: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string().nullable(),
});

export const generatedResumeSchema = z.object({
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),

  summary: z.string().nullable(),

  skills: z.array(z.string()),
  certificate: z.array(z.string()),

  visaInfo: z.string().nullable(),
  availability: z.string().nullable(),

  educationSchool: z.string().nullable(),
  educationMajor: z.string().nullable(),
  educationYear: z.number().nullable(),

  jobExperiences: z.array(jobExperienceSchema),
});

export type GeneratedResume = z.infer<typeof generatedResumeSchema>;
