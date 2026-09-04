"use client";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GeneratePage() {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const generateResume = async () => {
      if (!token) {
        return;
      }
      const response = await fetch(`/api/resumes/${id}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("履歴書の生成に失敗しました");
      }
    };

    const handleGenerate = async () => {
      try {
        await Promise.all([
          generateResume(),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);

        router.push(`/resumes/${id}/preview`);
      } catch (error) {
        console.error(error);
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
