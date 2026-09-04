import { JobType, ResumeStatus } from "@/app/generated/prisma/enums";
import { z } from "zod";

const jobExperienceResponseSchema = z.object({
  id: z.string(),
  resumeId: z.string(),
  companyName: z.string(),
  position: z.string(),
  jobType: z.string(),
  description: z.array(z.string()),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const resumeResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().nullable(),
  jobType: z.enum(JobType),
  status: z.enum(ResumeStatus),

  fullName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  photoUrl: z.string().nullable(),

  summary: z.string().nullable(),
  skills: z.array(z.string()),
  certificate: z.array(z.string()),
  visaInfo: z.string().nullable(),
  availability: z.string().nullable(),

  educationSchool: z.string().nullable(),
  educationMajor: z.string().nullable(),
  educationYear: z.number().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),

  jobExperiences: z.array(jobExperienceResponseSchema),
});

export const resumeShowResponseSchema = z.object({
  resume: resumeResponseSchema,
});

export type ResumeShowResponse = z.infer<typeof resumeShowResponseSchema>;
