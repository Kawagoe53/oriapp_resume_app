import { Prisma } from "@/app/generated/prisma/client";
import { JobType } from "@/app/generated/prisma/enums";

export type UpdateResumeRequestBody = {
  resume: {
    title: string;
    jobType: JobType;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    photoUrl: string | null;
    summary: string | null;
    skills: Prisma.InputJsonValue;
    certificate: Prisma.InputJsonValue;
    visaInfo: string;
    availability: string;
    educationSchool: string | null;
    educationMajor: string | null;
    educationYear: number | null;
  };

  jobExperiences: {
    jobType: string;
    companyName: string;
    position: string;
    description: string[];
    startDate: string;
    endDate?: string | null;
  }[];
};
