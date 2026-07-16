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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 },
  );
};
