"use client";

import { actionButtonVariants } from "@/app/_components/ui/actionButtonVariants";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/app/_libs/supabase";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading, isPasswordRecovery } = useSupabaseSession();
  const isResetPage = pathname === "/reset-password" || pathname === "/forgot-password";
  // 新規登録の確認リンクもOTPになる。通常のパスワードログインは妨げない。
  const isRestrictedLoginPage = isPasswordRecovery && pathname === "/login";
  const isLoggedIn = Boolean(session);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isPasswordRecovery && !isResetPage && !isRestrictedLoginPage) {
      router.replace("/reset-password");
    }
  }, [isLoading, isPasswordRecovery, isResetPage, isRestrictedLoginPage, router]);

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

  // 再設定画面には通常のナビゲーションを出さず、他画面も描画しない。
  if (isResetPage || isRestrictedLoginPage) return <main className="min-h-screen px-6 py-12">{children}</main>;
  if (isLoading || isPasswordRecovery) return <p role="status">ログイン状態を確認中…</p>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="resume-navigation border-r border-border bg-surface [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-primary [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-primary fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-y-auto">
        <Link
          href="/"
          aria-label="rereki. トップページへ"
          className="mx-8 mb-14 mt-10 inline-block self-start rounded text-3xl font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          rereki<span className="text-primary">.</span>
        </Link>

        <nav className="space-y-2 px-4">
          <Link
            href={isLoggedIn ? "/resumes" : "/login"}
            data-selected={isSelected("/resumes")}
            className="block rounded px-4 py-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:font-semibold data-[selected=true]:text-primary motion-reduce:transition-none"
          >
            履歴書一覧
          </Link>

          <Link
            href={isLoggedIn ? "/aiUsage" : "/login"}
            data-selected={isSelected("/aiUsage")}
            className="block rounded px-4 py-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:font-semibold data-[selected=true]:text-primary motion-reduce:transition-none"
          >
            AI使用回数
          </Link>
          <Link
            href="/contact"
            data-selected={isSelected("/contact")}
            className="block rounded px-4 py-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:font-semibold data-[selected=true]:text-primary motion-reduce:transition-none"
          >
            お問い合わせ
          </Link>
        </nav>
        <div className="mt-auto px-4 pb-4 pt-8">
          {authError && <p className="text-sm text-danger mb-3">{authError}</p>}
          {isLoading ? (
            <p className="text-muted-foreground px-4 py-3 text-sm">ログイン状態を確認中…</p>
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={actionButtonVariants({ variant: "secondary", size: "default", className: "w-full" })}
            >
              {isSigningOut ? "ログアウト中…" : "ログアウト"}
            </button>
          ) : (
            <Link href="/login" className={actionButtonVariants({ variant: "primary", size: "default", className: "w-full" })}>
              ログイン
            </Link>
          )}
        </div>
      </aside>

      <main
        className={`protected-content ml-60 min-h-screen ${pathname === "/contact" ? "px-6 py-6 lg:px-12 lg:py-8" : "px-12 py-14"}`}
      >
        {children}
      </main>
    </div>
  );
}
