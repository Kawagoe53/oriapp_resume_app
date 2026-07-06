import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { ResumeStatus } from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

// 投稿一覧APIのレスポンスの型
export type ResumesIndexResponse = {
  resumes: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: ResumeStatus;
  }[];
};

export const GET = async (request: NextRequest) => {
  //フロントから受けとったAuthorizationを使う
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  //getUserはtokenをSupabaseへ送って、そのtokenに対応するuser情報を取得する

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
  //userがnullの可能性もあるため追加
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // tokenが正しい場合、以降が実行される
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
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

    // レスポンスを返す
    return NextResponse.json<ResumesIndexResponse>(
      { resumes },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
  //下記コードがないとinstanceof Errorじゃない時undefinedになってしまうからレスポンスを返せなくなる
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 },
  );
};
