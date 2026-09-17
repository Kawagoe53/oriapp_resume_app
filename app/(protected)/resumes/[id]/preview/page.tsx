"use client";

import useFetch from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { ResumeShowResponse } from "@/app/_schemas/resumeResponseSchema";
import { useParams } from "next/navigation";
import ResumePreview from "./_components/ResumePreview";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoading: sessionLoading } = useSupabaseSession();
  const { data, error, isLoading } = useFetch<ResumeShowResponse>(`/api/resumes/${id}`);

  if (sessionLoading || isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>履歴書の取得に失敗しました</div>;

  return <ResumePreview resume={data.resume} />;
}
