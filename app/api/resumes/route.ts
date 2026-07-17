import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { ChatRole, JobType, ResumeStatus } from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

export type ResumesIndexResponse = {
  resumes: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: ResumeStatus;
  }[];
};

export const GET = async (request: NextRequest) => {
  try {
    const userId = await getUserId(request);

    const resumes = await prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json<ResumesIndexResponse>(
      { resumes },
      { status: 200 },
    );
  } catch (error) {
    return buildError(error);
  }
};

type CreateResumeRequestBody = {
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
    companyName: string;
    position: string;
    jobType: JobType;
    startDate: Date;
    endDate: Date | null;
  }[];

  chatMessages: {
    role: ChatRole;
    content: string;
    stepNumber: number;
  }[];
};

export type CreatePostResponse = {
  id: string;
};

export const POST = async (request: NextRequest) => {
  try {
    const userId = await getUserId(request);

    const body: CreateResumeRequestBody = await request.json();
    const { resume, jobExperiences, chatMessages } = body;
    const data = await prisma.resume.create({
      data: {
        ...resume,
        userId,

        jobExperiences: {
          createMany: {
            data: jobExperiences,
          },
        },
        chatMessages: {
          createMany: {
            data: chatMessages,
          },
        },
      },
    });

    // レスポンスを返す
    return NextResponse.json<CreatePostResponse>({
      id: data.id,
    });
  } catch (error) {
    return buildError(error);
  }
};
