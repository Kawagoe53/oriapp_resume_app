"use client";

import useFetch from "@/app/_hooks/useFetch";
import { AiUsageResponse } from "@/app/api/ai-usage/route";
import Link from "next/link";

export default function AiUsagePage() {
  const { data, error, isLoading } = useFetch<AiUsageResponse>("/api/ai-usage");

  if (isLoading) {
    return <div className="mx-auto max-w-3xl p-8">読み込み中...</div>;
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-red-600">使用状況を取得できませんでした。</p>
      </div>
    );
  }

  const percentage = Math.min((data.used / data.limit) * 100, 100);
  const isLimitReached = data.remaining === 0;
  const resetDate = new Date(data.resetAt).toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl py-10">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-600">AI 使用状況</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">今月のAI生成回数</h1>
        <p className="mt-2 text-sm text-gray-600">
          履歴書のAI生成は、毎月 {data.limit} 回までご利用いただけます。
        </p>

        <div className="mt-8 rounded-xl bg-blue-50 p-6">
          <div className="flex items-end justify-between gap-4">
            <p className="text-lg font-semibold text-gray-900">
              {data.used} <span className="text-sm font-normal text-gray-600">/ {data.limit} 回使用</span>
            </p>
            <p className={`text-sm font-semibold ${isLimitReached ? "text-red-600" : "text-blue-700"}`}>
              残り {data.remaining} 回
            </p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-blue-100">
            <div
              className={`h-full rounded-full ${isLimitReached ? "bg-red-500" : "bg-blue-600"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 p-5 text-sm text-gray-600">
          <p className="font-medium text-gray-900">次回のリセット</p>
          <p className="mt-1">{resetDate} に使用回数がリセットされます。</p>
        </div>

        {isLimitReached ? (
          <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            今月のAI生成回数を使い切りました。次回のリセット後に、再度ご利用いただけます。
          </p>
        ) : (
          <Link
            href="/resumes"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            履歴書を作成する
          </Link>
        )}
      </div>
    </div>
  );
}
