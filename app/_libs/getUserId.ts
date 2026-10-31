import { NextRequest } from "next/server";
import { hasRecoveryMethod } from "./passwordRecovery";
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

  // 画面の移動制限を迂回してAPIを呼んでも、再設定セッションでは利用させない。
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  if (claimsError || !claimsData || hasRecoveryMethod(claimsData.claims.amr)) {
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
