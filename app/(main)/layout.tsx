"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/app/_libs/supabase";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();
  const isLoggedIn = Boolean(session);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" }); //現在のセッションをログアウトして
      if (error) throw error; //戻ってきたオブジェクトにerrorが含まれていたらエラーを投げる。

      router.replace("/login");
    } catch {
      setAuthError("ログアウトできませんでした。もう一度お試しください。");
    } finally {
      setIsSigningOut(false);
    }
  };
  const isSelected = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="rk-app">
      <aside className="resume-navigation rk-sidebar fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-y-auto">
        <Link
          href={isLoggedIn ? "/resumes" : "/login"}
          className="mx-8 mb-14 mt-10 inline-block self-start rounded text-3xl font-bold tracking-tight text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-800"
        >
          rireki<span>.</span>
        </Link>

        <nav className="space-y-2 px-4">
          <Link
            href={isLoggedIn ? "/resumes" : "/login"}
            data-selected={isSelected("/resumes")}
            className="rk-nav-link"
          >
            履歴書一覧
          </Link>

          <Link
            href={isLoggedIn ? "/aiUsage" : "/login"}
            data-selected={isSelected("/aiUsage")}
            className="rk-nav-link"
          >
            AI使用回数
          </Link>
        </nav>
        <div className="mt-auto px-4 pb-4 pt-8">
          {authError && <p className="rk-error mb-3">{authError}</p>}
          {isLoading ? (
            <p className="rk-muted px-4 py-3 text-sm">ログイン状態を確認中…</p>
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rk-button rk-button--secondary w-full"
            >
              {isSigningOut ? "ログアウト中…" : "ログアウト"}
            </button>
          ) : (
            <Link href="/login" className="rk-button rk-button--primary w-full">
              ログイン
            </Link>
          )}
        </div>
      </aside>

      <main className="protected-content ml-60 min-h-screen px-12 py-14">
        {children}
      </main>
    </div>
  );
}
