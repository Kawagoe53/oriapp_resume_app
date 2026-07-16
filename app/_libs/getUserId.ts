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
    throw new Error("Unauthorized");
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
    throw new Error("Unauthorized");
  }
  return currentUser.id;
}
