import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { supabase } from "./supabase";

export default async function getUserId(request: NextRequest) {
  const token = request.headers.get("Authorization") ?? "";
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      supabaseId: user.id,
    },
    select: {
      id: true,
    },
  });
  if (!currentUser) {
    return null;

    //currentUserが存在するならidを返す。存在しないならnullを返す。
    //”?? null”は左側がnullまたはudefinedならnullを返す
    return currentUser?.id ?? null;
  }
}
