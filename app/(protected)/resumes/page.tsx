"use client";

import useDeleteResume from "@/app/_hooks/useDeleteResume";
import useResumes from "@/app/_hooks/useResumes";
import Link from "next/link";

export default function GetResumes() {
  const { data, error, isLoading } = useResumes();

  const { deleteResume, deletingId, deleteError } = useDeleteResume();

  const resumes = data?.resumes ?? [];
  if (isLoading) {
    return (
      <div
        className="max-w-3xl mx-auto 
      p-8"
      >
        <p>ローディング中...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8">
        <p className="text-red-600">{error.message}</p>
        <Link href="/resumes" className="text-blue-600">
          一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {deleteError && (
        <p role="alert" className="mb-4 text-red-600">
          {deleteError}
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="flex h-72 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link
              href={`/resumes/${resume.id}/chat`}
              className="flex min-h-0 flex-1 flex-col rounded focus-visible:outline-2 focus-visible:outline-blue-600"
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
            <button
              type="button"
              disabled={deletingId !== null}
              onClick={() => void deleteResume(resume.id, resume.title)}
              aria-label={`${resume.title || "無題の履歴書"}を削除`}
              className="mt-3 self-end rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingId === resume.id ? "削除中…" : "削除"}
            </button>
          </div>
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
