import buildError from "@/app/_libs/buildError";
import getUserId from "@/app/_libs/getUserId";
import { openai } from "@/app/_libs/openai";
import { prisma } from "@/app/_libs/prisma";
import { generatedResumeSchema } from "@/app/_schemas/aiResponseSchema";
import { NextRequest, NextResponse } from "next/server";
import { zodTextFormat } from "openai/helpers/zod";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    // ① ユーザー確認
    const userId = await getUserId(request);

    // ② Resume確認
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: "履歴書が見つかりません" },
        { status: 404 },
      );
    }

    // ③ ChatMessage取得
    const chatMessages = await prisma.chatMessage.findMany({
      where: {
        resumeId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    // ④ 質問・回答に整理
    const forPromptQuestionAnswer = chatMessages
      .filter((chatMessage) => chatMessage.role === "ASSISTANT")
      .map((question) => {
        const answer = chatMessages.find(
          (chatMessage) =>
            chatMessage.role === "USER" &&
            chatMessage.stepNumber === question.stepNumber,
        );

        if (!answer) {
          throw new Error("回答が見つかりません");
        }

        return {
          stepNumber: question.stepNumber,
          question: question.content,
          answer: answer.content,
        };
      });

    // ⑤ プロンプト作成
    const prompt = `
  あなたは、オーストラリアで使用する英文Resumeを作成する専門家です。

  以下の質問とユーザーの回答をもとに、Resumeに保存するデータを作成してください。

  【ルール】
  - 日本語の回答は自然な英語に変換してください
  - オーストラリアのResumeに適した表現にしてください
  - ユーザーが回答していない情報を推測して追加しないでください
  - 情報がない項目はnullにしてください
  - skills、certificate、jobExperiencesに該当する情報がない場合はnullではなく空配列[]を返してください
  - skills、certificate、jobExperiencesは必ず配列で返してください
  - startDateとendDateはYYYY形式（年のみ）で返してください
  - 現在も勤務中の場合、endDateはnullにしてください

  - summaryは、ユーザーの回答に含まれる職歴・スキル・人物特性などの情報から作成してください
  - Summaryを作成できる情報が1つでもある場合は、簡潔な英文Summaryを生成してください
  - Summaryを作成するための情報が全くない場合のみnullにしてください
  - ユーザーが回答していない具体的な経験・スキル・資格などを推測して追加しないでください

  以下のJSON形式で返してください。

  {
    "fullName": string | null,
    "email": string | null,
    "phone": string | null,
    "address": string | null,
    "summary": string | null,
    "skills": string[],
    "certificate": string[],
    "visaInfo": string | null,
    "availability": string | null,
    "educationSchool": string | null,
    "educationMajor": string | null,
    "educationYear": number | null,
    "jobExperiences": [
      {
        "companyName": string,
        "position": string,
        "jobType": string,
        "description": string[],
        "startDate": string,
        "endDate": string | null
      }
    ]
  }

  【質問と回答】
  ${forPromptQuestionAnswer
    .map(
      ({ question, answer }) => `
  質問: ${question}
  回答: ${answer ?? "未回答"}
  `,
    )
    .join("\n")}
  `;
    // ⑥ AI呼び出し
    const response = await openai.responses.parse({
      model: "gpt-5.4-mini",
      input: prompt,
      text: {
        format: zodTextFormat(generatedResumeSchema, "generated_resume"),
      },
    });

    const generatedResume = response.output_parsed;
    if (!generatedResume) {
      throw new Error("履歴書データの生成に失敗しました");
    }

    await prisma.$transaction(async (tx) => {
      await tx.jobExperience.deleteMany({
        where: {
          resumeId: id,
        },
      });
      // ⑧ Resume更新
      await tx.resume.update({
        where: {
          id,
        },
        data: {
          fullName: generatedResume.fullName,
          email: generatedResume.email,
          phone: generatedResume.phone,
          address: generatedResume.address,
          summary: generatedResume.summary,
          skills: generatedResume.skills,
          certificate: generatedResume.certificate,
          visaInfo: generatedResume.visaInfo,
          availability: generatedResume.availability,
          educationSchool: generatedResume.educationSchool,
          educationMajor: generatedResume.educationMajor,
          educationYear: generatedResume.educationYear,
        },
      });
      await tx.jobExperience.createMany({
        data: generatedResume.jobExperiences.map((jobExperience) => ({
          resumeId: id,
          companyName: jobExperience.companyName,
          position: jobExperience.position,
          jobType: jobExperience.jobType,
          description: jobExperience.description ?? [],
          startDate: new Date(`${jobExperience.startDate}-01-01`),
          endDate: jobExperience.endDate
            ? new Date(`${jobExperience.endDate}-01-01`)
            : null,
        })),
      });
    });

    return NextResponse.json(
      { message: "Resumeを生成しました" },
      { status: 200 },
    );
  } catch (error) {
    return buildError(error);
  }
};
