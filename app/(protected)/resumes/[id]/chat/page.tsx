"use client";

import useFetch from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { chatSchema, ChatSchemaValues } from "./chatSchema";
import ChatMessage from "./components/ChatMessage";

type MessagesShowResponse = {
  chatMessages: {
    id: string;
    role: "ASSISTANT" | "USER";
    content: string;
    stepNumber: number;
  }[];
};

export default function ResumeChatPage() {
  const { token } = useSupabaseSession();
  const params = useParams();
  const resumeId = params.id;
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChatSchemaValues>({ resolver: zodResolver(chatSchema) });

  const {
    data: chatData,
    error,
    isLoading,
    mutate,
  } = useFetch<MessagesShowResponse>(`/api/resumes/${resumeId}/chat`);

  const onSubmit = async (data: ChatSchemaValues) => {
    if (!token) {
      return;
    }
    //↓ユーザーが回答している質問のstepNumberを取得
    const currentQuestion = chatData?.chatMessages
      .filter((message) => message.role === "ASSISTANT")
      .at(-1);

    if (!currentQuestion) {
      return;
    }

    setSubmitError(null);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          content: data.message,
          stepNumber: currentQuestion.stepNumber,
        }),
      });

      if (!res.ok) {
        throw new Error("メッセージの送信に失敗しました");
      }

      const result = await res.json();
      if (result.isCompleted) {
        setIsCompleted(true);
      }
      await mutate();
      reset();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "メッセージの送信に失敗しました",
      );
    }
  };
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4">
        <div className="flex items-center gap-4">
          <Link href="/resumes">← 戻る</Link>
          <h1 className="text-lg font-bold">カフェ店員</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <p>ローディング中...</p>
        ) : error ? (
          <p>チャットの読み込みに失敗しました。</p>
        ) : (
          chatData?.chatMessages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))
        )}
      </main>

      <footer className="border-t p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2"
            type="text"
            placeholder="メッセージを入力..."
            {...register("message")}
          />
          {errors.message && <p>{errors.message.message}</p>}
          {submitError && <p className="text-red-500">{submitError}</p>}
          {isCompleted ? (
            <button type="button">Resume作成</button>
          ) : (
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "送信中..." : "送信"}
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}
