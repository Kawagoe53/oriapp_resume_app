import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { JobType, ResumeStatus } from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

export type ResumeShowResponse = {
  resume: {
    id: string;
    userId: string;
    title: string;
    jobType: JobType;
    status: ResumeStatus;

    fullName: string;
    email: string;
    phone: string;
    address: string;
    photoUrl: string | null;

    summary: string | null;
    skills: Prisma.JsonValue;
    certificate: Prisma.JsonValue;
    visaInfo: string;
    availability: string;

    educationSchool: string | null;
    educationMajor: string | null;
    educationYear: number | null;

    createdAt: Date;
    updatedAt: Date;
  };
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const userId = await getUserId(request);

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: "履歴書が見つかりません。" },
        { status: 404 },
      );
    }

    return NextResponse.json<ResumeShowResponse>({ resume }, { status: 200 });
  } catch (error) {
    return buildError(error);
  }
};

type UpdateResumeRequestBody = {
  resume: {
    title?: string;
    jobType?: JobType;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    photoUrl?: string | null;
    summary?: string | null;
    skills?: Prisma.InputJsonValue;
    certificate?: Prisma.InputJsonValue;
    visaInfo?: string;
    availability?: string;
    educationSchool?: string | null;
    educationMajor?: string | null;
    educationStartDate?: string | null;
    educationEndDate?: string | null;
    status?: ResumeStatus;
  };

  jobExperiences?: {
    jobType: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string | null;
  }[];
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const userId = await getUserId(request);

    const body: UpdateResumeRequestBody = await request.json();

    await prisma.resume.update({
      where: {
        id,
        userId,
      },
      data: body.resume,
    });

    if (body.jobExperiences) {
      await prisma.jobExperience.deleteMany({
        where: {
          resumeId: id,
        },
      });

      await prisma.jobExperience.createMany({
        data: body.jobExperiences.map((job) => ({
          resumeId: id,
          companyName: job.companyName,
          jobType: job.jobType,
          position: job.position,
          startDate: job.startDate,
          endDate: job.endDate,
        })),
      });
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return buildError(error);
  }
};
