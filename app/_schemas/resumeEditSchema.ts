import { z } from "zod";

const jobExperienceSchema = z.object({
  companyName: z.string(),
  position: z.string(),
  jobType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(
    z.object({
      value: z.string(),
    }),
  ),
});

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

  jobExperiences: z.array(jobExperienceSchema),
});

export type ResumeEditFormData = z.infer<typeof resumeEditSchema>;
