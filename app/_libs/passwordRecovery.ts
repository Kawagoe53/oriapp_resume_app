import type { Session } from "@supabase/supabase-js";

export function hasRecoveryMethod(amr: unknown): boolean {
  // Supabaseの標準メール（implicit flow）は、再設定でもOTPとして発行される。
  // OTPのセッションも通常APIでは制限し、パスワード/OAuthでの再ログインを求める。
  return Array.isArray(amr) && amr.some(
    (entry) => entry?.method === "recovery" || entry?.method === "otp",
  );
}

// 画面制御用。APIの認可では、getClaimsで署名検証した情報を使う。
export function isPasswordRecoverySession(session: Session | null | undefined): boolean {
  if (!session) return false;
  try {
    const payload = session.access_token.split(".")[1];
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return hasRecoveryMethod(claims.amr);
  } catch {
    return false;
  }
}
