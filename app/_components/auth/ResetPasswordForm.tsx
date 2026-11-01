"use client";

import usePasswordReset from "@/app/_hooks/usePasswordReset";
import { resetPasswordSchema, ResetPasswordValues } from "@/app/_schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ResetPasswordForm() {
  const { status, error, isProcessing, resetPassword, retrySignOut } = usePasswordReset();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ password }: ResetPasswordValues) => {
    if (await resetPassword(password)) reset();
  };

  return (
    <div className="mx-auto w-full max-w-100 space-y-4 pt-24">
      <h1 className="text-2xl font-bold">新しいパスワードの設定</h1>
      {status === "complete" ? (
        <div className="space-y-4" role="status">
          <p>パスワードを再設定しました。ログイン画面へ移動しています…</p>
        </div>
      ) : status === "loading" ? <p role="status">リンクを確認中…</p>
        : status === "invalid" ? (
          <div className="space-y-4">
            <p role="alert">リンクが無効、期限切れ、または使用済みです。再設定メールを再送してください。</p>
            <Link href="/forgot-password" className="block underline">再設定メールを再送する</Link>
          </div>
        ) : status === "google" ? (
          <div className="space-y-4"><p>Googleで登録した方は、Googleログインをご利用ください。</p><Link href="/login" className="underline">ログイン画面へ戻る</Link></div>
        ) : status === "updated" ? (
          <div className="space-y-4">
            <p>パスワードを更新しました。ログアウトを完了してください。</p>
            {error && <p role="alert" className="text-red-600">{error}</p>}
            <Button disabled={isProcessing} onClick={retrySignOut}>
              {isProcessing ? "ログアウト中…" : "ログアウトして完了する"}
            </Button>
          </div>
        ) : (
          <form onSubmit={(event) => { void handleSubmit(onSubmit)(event); }} className="space-y-4">
            <p>8文字以上で、半角英大文字・英小文字・数字をそれぞれ1文字以上含めてください。</p>
            <Input id="password" label="新しいパスワード" type="password" autoComplete="new-password"
              registration={register("password")} errorMessage={errors.password?.message} disabled={isSubmitting} />
            <Input id="confirmPassword" label="新しいパスワード（確認）" type="password" autoComplete="new-password"
              registration={register("confirmPassword")} errorMessage={errors.confirmPassword?.message} disabled={isSubmitting} />
            {error && <p role="alert" className="text-red-600">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "更新中…" : "パスワードを再設定"}</Button>
            <Link href="/forgot-password" className="block text-sm underline">再設定メールを再送する</Link>
          </form>
        )}
    </div>
  );
}
