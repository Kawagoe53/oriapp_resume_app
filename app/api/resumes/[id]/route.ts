import { jobExperiencesUpdateSchema } from "@/app/_schemas/resumeEditSchema";
import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import {
  ResumeShowResponse,
  resumeShowResponseSchema,
} from "@/app/_schemas/resumeResponseSchema";
import { UpdateResumeRequestBody } from "@/app/_types/edit";
import { NextRequest, NextResponse } from "next/server";

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
      include: {
        jobExperiences: true,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: "履歴書が見つかりません。" },
        { status: 404 },
      );
    }

    const response = {
      resume,
    };

    const parsedResponse = resumeShowResponseSchema.parse(response);

    return NextResponse.json<ResumeShowResponse>(parsedResponse, {
      status: 200,
    });
  } catch (error) {
    return buildError(error);
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const userId = await getUserId(request);

    const body: UpdateResumeRequestBody = await request.json();
    const parsedJobs = jobExperiencesUpdateSchema.safeParse(body?.jobExperiences);
    if (!parsedJobs.success) {
      return NextResponse.json(
        { message: parsedJobs.error.issues[0].message },
        { status: 400 },
      );
    }
    const { resume } = body;
    const jobExperiences = parsedJobs.data;

    await prisma.$transaction(async (tx) => {
      await tx.resume.update({
        where: {
          id,
          userId,
        },
        data: resume,
      });

      if (jobExperiences) {
        await tx.jobExperience.deleteMany({
          where: {
            resumeId: id,
          },
        });
        await tx.jobExperience.createMany({
          data: jobExperiences.map((job) => ({
            resumeId: id,
            companyName: job.companyName,
            jobType: job.jobType,
            position: job.position,
            description: job.description,
            startDate: new Date(job.startDate),
            endDate: job.endDate ? new Date(job.endDate) : null,
          })),
        });
      }
    });
    return NextResponse.json({ message: "更新しました" }, { status: 200 });
  } catch (error) {
    return buildError(error);
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const userId = await getUserId(request);

    const { count } = await prisma.resume.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (count === 0) {
      return NextResponse.json({ message: "履歴書が見つかりません。" }, { status: 404 });
    }

    return NextResponse.json({ message: "削除しました" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return buildError(error);
    }
    console.error("Failed to delete resume", error);
    return NextResponse.json({ message: "履歴書の削除に失敗しました。" }, { status: 500 });
  }
};
