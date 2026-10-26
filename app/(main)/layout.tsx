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
    <>
      <aside className="resume-navigation fixed inset-y-4 left-4 z-40 flex w-64 flex-col overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Link
          href={isLoggedIn ? "/resumes" : "/login"}
          className="mx-6 my-8 inline-block self-start rounded text-3xl font-bold tracking-tight text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          rireki<span className="text-indigo-700">.</span>
        </Link>

        <nav className="space-y-2 px-4">
          <Link
            href={isLoggedIn ? "/resumes" : "/login"}
            className={`block rounded-lg px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isSelected("/resumes")
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            履歴書一覧
          </Link>

          <Link
            href={isLoggedIn ? "/aiUsage" : "/login"}
            className={`block rounded-lg px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isSelected("/aiUsage")
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            AI使用回数
          </Link>
        </nav>
        <div className="mt-auto px-4 pb-4 pt-8">
          {authError && (
            <p className="mb-3 text-sm text-red-700">{authError}</p>
          )}
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-gray-500">
              ログイン状態を確認中…
            </p>
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-50"
            >
              {isSigningOut ? "ログアウト中…" : "ログアウト"}
            </button>
          ) : (
            <Link
              href="/login"
              className="block rounded-lg bg-indigo-700 px-4 py-3 text-center text-sm font-medium text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              ログイン
            </Link>
          )}
        </div>
      </aside>

      <main className="protected-content ml-68 min-h-screen bg-gray-50 px-8 py-4">
        {children}
      </main>
    </>
  );
}
