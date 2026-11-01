"use client";

import { supabase } from "@/app/_libs/supabase";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/app/_schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        // 登録状態に由来する応答からアカウントの有無を明かさない。
        if (error.code === "user_not_found" || error.code === "email_not_confirmed") {
          setSent(true);
          return;
        }
        setError(error.status === 429
          ? "送信回数が多すぎます。時間をおいてもう一度お試しください。"
          : "メールを送信できませんでした。時間をおいてもう一度お試しください。");
        return;
      }
      setSent(true);
    } catch {
      setError("通信に失敗しました。接続を確認してもう一度お試しください。");
    }
  };

  return (
    <div className="mx-auto w-full max-w-100 space-y-4 pt-24">
      <h1 className="text-2xl font-bold">パスワードの再設定</h1>
      {sent ? (
        <div className="space-y-4" role="status">
          <p>登録されている場合、再設定メールを送信しました。</p>
          <p>リンクの有効期限は送信から20分です。メールが届かない場合は迷惑メールフォルダもご確認ください。</p>
          <Button onClick={() => setSent(false)}>メールアドレスを確認・再送する</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p>登録したメールアドレスに再設定用のリンクを送信します。リンクの有効期限は20分です。</p>
          <Input id="email" label="メールアドレス" type="email" autoComplete="email"
            registration={register("email")} errorMessage={errors.email?.message} disabled={isSubmitting} />
          {error && <p role="alert" className="text-red-600">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "送信中…" : "再設定メールを送信"}</Button>
        </form>
      )}
      <p className="text-sm">Googleで登録した方は、Googleログインをご利用ください。</p>
      <Link href="/login" className="block text-sm underline">ログイン画面へ戻る</Link>
    </div>
  );
}
