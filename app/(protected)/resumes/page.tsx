"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ResumesIndexResponse } from "@/app/api/resumes/route";
import Link from "next/link";
import useSWR from "swr";

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      Authorization: token,
    },
  });
  return res.json();
};

export default function GetResumes() {
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useSWR<ResumesIndexResponse>(
    token ? ["/api/resumes/", token] : null,
    fetcher,
  );

  const resumes = data?.resumes ?? [];
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
