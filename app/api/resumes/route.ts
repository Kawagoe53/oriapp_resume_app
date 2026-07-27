import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import { JobType, ResumeStatus } from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

export type ResumesIndexResponse = {
  resumes: {
    id: string;
    title: string | null;
    createdAt: Date;
    status: ResumeStatus;
    jobType: JobType;
  }[];
};

export const GET = async (request: NextRequest) => {
  try {
    const userId = await getUserId(request);

    const resumes = await prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        jobType: true,
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

export type CreateResumeRequestBody = {
  resume: {
    jobType: JobType;
  };
};
export type CreateResumeResponse = {
  resume: {
    id: string;
  };
};

export const POST = async (request: NextRequest) => {
  try {
    const userId = await getUserId(request);

    const body: CreateResumeRequestBody = await request.json();
    const { resume } = body;
    const data = await prisma.resume.create({
      data: {
        userId,
        jobType: resume.jobType,
      },
    });

    return NextResponse.json<CreateResumeResponse>(
      {
        resume: {
          id: data.id,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return buildError(error);
  }
};
