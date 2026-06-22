"use client";

import { supabase } from "@/app/_libs/supabase"; // 前の工程で作成したファイル
import { loginSchema, LogInSchemaValues } from "@/app/_schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
        <div>
          <label
            htmlFor="email" //ラベルとinputの紐付け
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            メールアドレス
          </label>
          <input
            type="email" //入力形式
            id="email" //ラベルとinputの紐付け
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="name@company.com"
            disabled={isSubmitting} //送信中に入力できないようにしている
            {...register("email")} // ← これがないとRHFがinputを認識できない
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting} //送信中はボタンを押せないようにしている
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
