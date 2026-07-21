"use client";

import handleGoogleSignIn from "@/app/_libs/googleAuth";
import { supabase } from "@/app/_libs/supabase";
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
      router.push("/app/(protected)/resumes/page.tsxz");
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

        <Button type="submit" disabled={isSubmitting}>
          ログイン
        </Button>

        <div className="relative my-6">
          <div className="border-t border-gray-300" />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-3 text-sm text-white">
            または
          </span>
        </div>

        <Button type="button" onClick={handleGoogleSignIn}>
          Googleで登録
        </Button>
      </form>
    </div>
  );
}
