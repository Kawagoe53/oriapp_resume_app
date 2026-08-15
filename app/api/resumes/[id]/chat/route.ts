import { questions } from "@/app/_constants/questions";
import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

type CreateChatMessageRequestBody = {
  content: string;
  stepNumber: number;
};
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const userId = await getUserId(request);
    const body: CreateChatMessageRequestBody = await request.json();
    const { content, stepNumber } = body;
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

    await prisma.chatMessage.create({
      data: {
        resumeId: id,
        role: "USER",
        content,
        stepNumber,
      },
    });

    const nextStep = stepNumber + 1; //次のstepNumberの判断

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

    if (chatMessages.length === 0) {
      const firstQuestion = questions[0];
      const firstMessage = await prisma.chatMessage.create({
        data: {
          resumeId: id,
          role: "ASSISTANT",
          content: firstQuestion.question,
          stepNumber: firstQuestion.stepNumber,
        },
      });

      return NextResponse.json(
        { chatMessages: [firstMessage] },
        { status: 200 },
      );
    }
    return NextResponse.json({ chatMessages }, { status: 200 });
  } catch (error) {
    console.error("GET chat error:", error);
    return buildError(error);
  }
};
