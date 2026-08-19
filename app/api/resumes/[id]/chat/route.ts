import { questions } from "@/app/_constants/questions";
import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import { CreateChatMessageRequestBody } from "@/app/_types/chat";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const userId = await getUserId(request);
    const body: CreateChatMessageRequestBody = await request.json();
    const { content } = body;
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!resume) {
      return new NextResponse(null, {
        status: 404,
      });
    }

    const latestQuestion = await prisma.chatMessage.findFirst({
      where: {
        resumeId: id,
        role: "ASSISTANT",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestQuestion) {
      return NextResponse.json(
        { message: "現在の質問が見つかりません。" },
        { status: 400 },
      );
    }
    await prisma.chatMessage.create({
      data: {
        resumeId: id,
        role: "USER",
        content,
        stepNumber: latestQuestion.stepNumber,
      },
    });

    const nextStep = latestQuestion.stepNumber + 1; //次のstepNumberの判断

    const nextQuestion = questions.find(
      //questions.tsから一致するものを取得
      (question) => question.stepNumber === nextStep,
    );

    if (!nextQuestion) {
      //質問がなくなったら下記を返す
      return NextResponse.json(
        {
          message: null,
          isCompleted: true,
        },
        { status: 200 },
      );
    }

    const nextMessage = await prisma.chatMessage.create({
      //質問があれば下記をDBに登録してnextMessageを返す
      data: {
        resumeId: id,
        role: "ASSISTANT",
        content: nextQuestion.question,
        stepNumber: nextQuestion.stepNumber,
      },
    });

    return NextResponse.json(
      {
        message: nextMessage,
        isCompleted: false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST submit error:", error);
    return buildError(error);
  }
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
        { message: "会話履歴が見つかりません。" },
        { status: 404 },
      );
    }

    const chatMessages = await prisma.chatMessage.findMany({
      where: {
        resumeId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ chatMessages }, { status: 200 });
  } catch (error) {
    return buildError(error);
  }
};
