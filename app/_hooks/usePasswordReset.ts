"use client";

import { isPasswordRecoverySession } from "@/app/_libs/passwordRecovery";
import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ResetStatus = "loading" | "ready" | "invalid" | "google" | "updated" | "complete";

export default function usePasswordReset() {
  const router = useRouter();
  const [status, setStatus] = useState<ResetStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    const checkLink = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const { data: { session } } = await supabase.auth.getSession();
        if (!active) return;
        const hasToken = Boolean(params.get("token_hash")) && params.get("type") === "recovery";
        setStatus(hasToken || isPasswordRecoverySession(session) ? "ready" : "invalid");
      } catch {
        if (active) setStatus("invalid");
      }
    };
    void checkLink();
    return () => { active = false; };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
    setStatus("complete");
    router.replace("/login?passwordReset=complete");
  };

  const retrySignOut = async () => {
    if (status !== "updated" || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    try {
      await signOut();
    } catch {
      setError("ログアウトできませんでした。接続を確認してもう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  // 共通クライアントが認証状態を保持するため、更新失敗後も再試行できる。
  const resetPassword = async (password: string): Promise<boolean> => {
    if (status !== "ready" || isProcessing) return false;
    setIsProcessing(true);
    setError(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token_hash");
      if (token) {
        if (params.get("type") !== "recovery") {
          setStatus("invalid");
          return false;
        }
        const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: "recovery" });
        if (error) {
          if (!error.status || error.status === 429 || error.status >= 500) {
            setError("リンクを確認できませんでした。時間をおいてもう一度お試しください。");
          } else {
            setStatus("invalid");
          }
          return false;
        }
        window.history.replaceState(null, "", window.location.pathname);
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      // 通常のログインセッションだけでは、再設定を許可しない。
      if (sessionError || !isPasswordRecoverySession(session)) {
        setStatus("invalid");
        return false;
      }
      if (!session?.user.identities?.some((identity) => identity.provider === "email")) {
        setStatus("google");
        const { error } = await supabase.auth.signOut({ scope: "local" });
        if (error) throw error;
        return false;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.code === "same_password"
          ? "現在と異なるパスワードを入力してください。"
          : "パスワードを更新できませんでした。もう一度お試しください。改善しない場合はメールを再送してください。");
        return false;
      }
      setStatus("updated");
      try {
        await signOut();
      } catch {
        setError("パスワードは更新済みです。ログアウトをもう一度お試しください。");
      }
      return true;
    } catch {
      setError("処理を完了できませんでした。接続を確認してもう一度お試しください。");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { status, error, isProcessing, resetPassword, retrySignOut };
}
