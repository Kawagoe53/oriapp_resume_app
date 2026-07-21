"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/app/_libs/supabase";
import { JobType, ResumeStatus } from "@/app/generated/prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ResumeIndexResponse = {
  resumes: {
    id: string;
    title: string;
    createdAt: string;
    status: ResumeStatus;
    jobType: JobType;
  }[];
};

export default function GetResumes() {
  const { token } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeIndexResponse["resumes"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log(session?.access_token);
      try {
        if (!token) {
          return;
        }
        const res = await fetch("/api/resumes/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const data: ResumeIndexResponse = await res.json();
        const { resumes } = data;
        setResumes(resumes);
      } catch (error) {
        console.error(error);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, [token]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>ローディング中...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="text-blue-600">
          一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {resumes.map((resume) => (
          <Link
            key={resume.id}
            href={`/resumes/${resume.id}/chat`}
            className="flex h-72 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 text-5xl">📄</div>

            <h2 className="text-lg font-bold text-gray-900">
              {resume.title || "無題の履歴書"}
            </h2>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>業種：{resume.jobType}</p>
              <p>状態：{resume.status}</p>
            </div>

            <div className="mt-auto text-xs text-gray-400">
              {new Date(resume.createdAt).toLocaleDateString("ja-JP")}
            </div>
          </Link>
        ))}

        <Link
          href="/resumes/new"
          className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 transition hover:bg-blue-100 hover:border-blue-500"
        >
          <div className="text-6xl font-light text-blue-500">＋</div>

          <p className="mt-4 text-lg font-semibold text-blue-600">新規作成</p>
        </Link>
      </div>
    </div>
  );
}
