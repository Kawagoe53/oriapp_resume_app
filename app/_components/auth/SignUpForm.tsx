"use client";

import { supabase } from "@/app/_libs/supabase"; // 前の工程で作成したファイル
import { signUpSchema, SignUpSchemaValues } from "@/app/_schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchemaValues) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        //supabaseのsignUpに任意で渡せる追加設定（リダイレクト先やユーザー情報など）
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/login`, //メールで認証ボタン押すとログイン画面に遷移
      },
    });
    if (error) {
      alert("登録に失敗しました");
    } else {
      reset();
      alert("確認メールを送信しました。");
    }
  };

  return (
    <div className="flex justify-center pt-60">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-100"
      >
        <Input
          label="メールアドレス"
          id="email"
          type="email"
          placeholder="name@company.com"
          disabled={isSubmitting}
          registration={register("email")}
          errorMessage={errors.email?.message}
        />

        <Input
          label="パスワード"
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
          registration={register("password")}
          errorMessage={errors.password?.message}
        />

        <Input
          label="パスワード確認"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
          registration={register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
        />

        <Button disabled={isSubmitting}>登録</Button>
      </form>
    </div>
  );
}
