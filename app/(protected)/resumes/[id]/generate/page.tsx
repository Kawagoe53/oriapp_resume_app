"use client";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";

export default function GeneratePage() {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { mutate } = useSWRConfig();
  const startedRequest = useRef<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const requestKey = `${id}:${token}:${attempt}`;
    // React Strict Mode can run the effect twice; send only one request per attempt.
    if (startedRequest.current === requestKey) return;
    startedRequest.current = requestKey;

    const handleGenerate = async () => {
      try {
        const response = await fetch(`/api/resumes/${id}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
        });
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message ?? "履歴書の生成に失敗しました");
        }
        await mutate((key) => Array.isArray(key) && key[0] === "/api/resumes", undefined, { revalidate: true });
        router.replace(`/resumes/${id}/preview`);
      } catch (error) {
        setError(error instanceof Error ? error.message : "履歴書の生成に失敗しました");
      }
    };
    void handleGenerate();
  }, [id, router, token, attempt, mutate]);

  if (error) {
    return (
      <div>
        <p role="alert">{error}</p>
        <button type="button" onClick={() => { setError(null); setAttempt((value) => value + 1); }}>再試行する</button>
        <Link href={`/resumes/${id}/chat`}>チャットに戻る</Link>
        <Link href="/resumes">一覧に戻る</Link>
      </div>
    );
  }

  return <div><p>履歴書を生成しています。しばらくお待ちください。</p></div>;
}
