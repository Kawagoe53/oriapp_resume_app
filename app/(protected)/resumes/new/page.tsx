"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreateResumeRequestBody } from "@/app/api/resumes/route";
import { JobType } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";

import { useState } from "react";
import SelectJobType from "./_components/SelectJobType";

export default function NewResumePage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const onSelectJobType = async (jobType: JobType) => {
    try {
      if (!token) return;
      const requestBody: CreateResumeRequestBody = {
        resume: {
          jobType,
        },
      };
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        setError("送信に失敗しました");
        return;
      }

      const data = await res.json();
      router.push(`/resumes/${data.resume.id}/chat`);
    } catch (error) {
      console.error(error);
      setError("エラーが発生しました");
    }
  };

  return (
    <div>
      <SelectJobType onSelectJobType={onSelectJobType} />
      {error && <p>{error}</p>}
    </div>
  );
}
