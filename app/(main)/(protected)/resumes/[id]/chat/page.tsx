"use client";

import { actionButtonVariants } from "@/app/_components/ui/actionButtonVariants";

import useFetch from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { CreateChatMessageRequestBody, MessagesShowResponse } from "@/app/_types/chat";
import { ResumeStatus } from "@/app/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { chatSchema, ChatSchemaValues } from "./chatSchema";
import ChatMessage from "./components/ChatMessage";

export default function ResumeChatPage() {
  const { token } = useSupabaseSession();
  const params = useParams();
  const resumeId = params.id;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChatSchemaValues>({ resolver: zodResolver(chatSchema) });

  const {
    data: chatData,
    error,
    mutate,
  } = useFetch<MessagesShowResponse>(`/api/resumes/${resumeId}/chat`);

  const onSubmit = async (data: ChatSchemaValues) => {
    if (!token || chatData?.isAnswered || chatData?.status === ResumeStatus.COMPLETED) {
      return;
    }

    setSubmitError(null);

    try {
      const body: CreateChatMessageRequestBody = {
        content: data.message,
      };
      const res = await fetch(`/api/resumes/${resumeId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("メッセージの送信に失敗しました");
      }

      const result = await res.json();
      await mutate((current) => current ? { ...current, isAnswered: result.isAnswered } : current);
      reset();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "メッセージの送信に失敗しました",
      );
    }
  };

  const handleGenerate = () => {
    router.push(`/resumes/${resumeId}/generate`);
  };

  if (error) {
    return <p>チャットの読み込みに失敗しました。</p>;
  }
  if (!chatData) {
    return <p>ローディング中...</p>;
  }
  if (chatData.chatMessages.length === 0) {
    return <p> データがありません</p>;
  }
  return (
    <div className="border border-border bg-card mx-auto flex h-[calc(100dvh-7rem)] min-h-[480px] max-w-4xl flex-col overflow-hidden rounded-xl">
      <header className="border-b bg-secondary p-4">
        <div className="flex items-center gap-4">
          <Link className="text-primary underline underline-offset-4 text-sm" href="/resumes">← 戻る</Link>
          <h1 className="text-lg font-bold">カフェ店員</h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {chatData.chatMessages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
      </main>

      <footer className="border-t p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-center gap-3">
          <input
            disabled={isSubmitting || chatData.isAnswered || chatData.status === ResumeStatus.COMPLETED}
            className="border border-input bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 min-w-0 flex-1 rounded-lg px-3 py-3"
            type="text"
            placeholder="メッセージを入力..."
            {...register("message")}
          />
          {errors.message && <p>{errors.message.message}</p>}
          {submitError && <p className="text-red-500">{submitError}</p>}
          {chatData.status === ResumeStatus.COMPLETED ? (
            <Link className={actionButtonVariants({ variant: "primary", size: "default" })} href={`/resumes/${resumeId}/preview`}>プレビューを見る</Link>
          ) : chatData.isAnswered ? (
            <button className={actionButtonVariants({ variant: "primary", size: "default" })} type="button" onClick={handleGenerate}>
              履歴書を生成する
            </button>
          ) : (
            <button className={actionButtonVariants({ variant: "primary", size: "default" })} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "送信中..." : "送信"}
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}
