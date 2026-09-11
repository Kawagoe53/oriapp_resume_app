"use client";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GeneratePage() {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const handleGenerate = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`/api/resumes/${id}/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message ?? "履歴書の生成に失敗しました");
        }

        router.push(`/resumes/${id}/preview`);
      } catch (error) {
        alert(error instanceof Error ? error.message : "履歴書の生成に失敗しました");
        router.push("/aiUsage");
      }
    };
    handleGenerate();
  }, [id, router, token]);

  return (
    <div>
      <p>Creating your resume...</p>
      <p>Please wait...</p>
    </div>
  );
}
