"use client";

import { supabase } from "@/app/_libs/supabase"; // 前の工程で作成したファイル
import { loginSchema, LogInSchemaValues } from "@/app/_schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LogInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LogInSchemaValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LogInSchemaValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert("ログインに失敗しました");
    } else {
      reset();
      router.push("/admin/resumes");
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

        <Button disabled={isSubmitting}>ログイン</Button>
      </form>
    </div>
  );
}
