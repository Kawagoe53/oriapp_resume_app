"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { getDefaultResumeTitle } from "@/app/_libs/resumeTitle";
import {
  createResumeSchema,
  MAX_RESUME_TITLE_LENGTH,
} from "@/app/_schemas/resumeTitleSchema";
import type {
  CreateResumeRequestBody,
  CreateResumeResponse,
} from "@/app/api/resumes/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import SelectJobType from "./_components/SelectJobType";

type NewResumeFormData = z.infer<typeof createResumeSchema>;

export default function NewResumePage() {
  const router = useRouter();
  const { token } = useSupabaseSession();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewResumeFormData>({
    resolver: zodResolver(createResumeSchema),
    defaultValues: { resume: { title: "" } },
  });
  const jobType = useWatch({ control, name: "resume.jobType" });

  const createResume = async (values: NewResumeFormData) => {
    try {
      if (!token) {
        setError("root.submit", { message: "ログインしてください" });
        return;
      }
      const requestBody: CreateResumeRequestBody = values;
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        const result = await res.json();
        setError("root.submit", {
          message: result.message || "送信に失敗しました",
        });
        return;
      }

      const data: CreateResumeResponse = await res.json();
      router.push(`/resumes/${data.resume.id}/chat`);
    } catch (error) {
      console.error(error);
      setError("root.submit", { message: "エラーが発生しました" });
    }
  };

  return (
    <form
      className="mx-auto max-w-3xl px-6 py-12"
      onSubmit={handleSubmit(createResume)}
    >
      <Controller
        name="resume.jobType"
        control={control}
        render={({ field }) => (
          <SelectJobType
            onSelectJobType={field.onChange}
            selectedJobType={field.value ?? null}
          />
        )}
      />
      {errors.resume?.jobType && (
        <p role="alert" className="mb-4 text-red-600">
          {errors.resume.jobType.message}
        </p>
      )}
      <label htmlFor="resume-title" className="mb-2 block font-semibold">
        タイトル（任意）
      </label>
      <input
        id="resume-title"
        {...register("resume.title")}
        maxLength={MAX_RESUME_TITLE_LENGTH}
        placeholder={
          jobType ? getDefaultResumeTitle(jobType) : "例：〇〇店への応募用"
        }
        className="w-full rounded border border-gray-300 p-3"
      />
      <p id="resume-title-hint" className="mt-2 text-sm text-gray-500">
        自分用の管理名です。提出する履歴書には表示されません（50文字以内）。未入力の場合は業種に応じた名前が付きます。
      </p>
      <p id="resume-title-error" role="alert" className="text-red-600">
        {errors.resume?.title?.message}
      </p>
      {errors.root?.submit && (
        <p role="alert" className="mt-4 text-red-600">
          {errors.root.submit.message}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !jobType}
        className="mt-6 rounded bg-blue-600 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "作成中…" : "作成してチャットへ"}
      </button>
    </form>
  );
}
