"use client";

import { actionButtonVariants } from "@/app/_components/ui/actionButtonVariants";

import useDeleteResume from "@/app/_hooks/useDeleteResume";
import useResumes from "@/app/_hooks/useResumes";
import { ResumeStatus } from "@/app/generated/prisma/enums";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const createdAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Tokyo",
});

const jobLabels = { CAFE: "カフェ・飲食", FARM: "農業", HOTEL: "ホテル" };

export default function GetResumes() {
  const { data, error, isLoading } = useResumes();
  const { deleteResume, deletingId, deleteError } = useDeleteResume();
  const resumes = data?.resumes ?? [];

  if (isLoading) return <p className="text-muted-foreground p-8">履歴書を読み込み中…</p>;
  if (error)
    return (
      <div className="text-sm text-danger p-8">
        {error.message}
        <Link href="/resumes" className="text-primary underline underline-offset-4 ml-4">
          一覧へ戻る
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">履歴書</h1>
        <Link href="/resumes/new" className={actionButtonVariants({ variant: "primary", size: "default" })}>
          新規作成
        </Link>
      </div>
      {deleteError && <p className="text-sm text-danger mb-4">{deleteError}</p>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {resumes.map((resume) => {
          const completed = resume.status === ResumeStatus.COMPLETED;
          const title = resume.title || "無題の履歴書";
          const createdAt = new Date(resume.createdAt);
          return (
            <article key={resume.id} className="flex min-h-[220px] min-w-0 flex-col rounded-[10px] border border-border bg-white p-6 shadow-[0_2px_4px_rgb(0_0_0/2%)] transition-[border-color,box-shadow] duration-150 hover:border-input hover:shadow-[0_4px_12px_rgb(0_0_0/4%)] motion-reduce:transition-none [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-primary [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-primary">
              <div className="flex items-start gap-3">
                <h2 className="min-w-0 flex-1 text-base font-semibold leading-6">
                  <Link
                    href={`/resumes/${resume.id}/${completed ? "preview" : "chat"}`}
                    className="line-clamp-2"
                    title={title}
                  >
                    {title}
                  </Link>
                </h2>
                <button
                  type="button"
                  className="-mt-0.5 shrink-0 cursor-pointer rounded bg-transparent px-2 py-1 text-xs leading-[1.5] text-danger transition-colors duration-150 hover:enabled:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  disabled={deletingId !== null}
                  onClick={() => void deleteResume(resume.id, resume.title)}
                >
                  {deletingId === resume.id ? "削除中…" : "削除"}
                </button>
              </div>
              <p className="text-muted-foreground mt-5 text-sm">
                {jobLabels[resume.jobType]}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                {completed ? "完成" : "作成途中"}
              </p>
              <time
                className="mt-auto block pt-6 text-[11px] leading-[1.5] text-muted-foreground tabular-nums"
                dateTime={createdAt.toISOString()}
                title="作成日時（日本時間）"
              >
                {createdAtFormatter.format(createdAt)} 作成
              </time>
              <Link
                href={`/resumes/${resume.id}/${completed ? "preview" : "chat"}`}
                className="flex items-center justify-between gap-3 pt-4 text-sm font-medium text-primary [&_svg]:transition-transform [&_svg]:duration-150 hover:[&_svg]:translate-x-[3px] motion-reduce:[&_svg]:transition-none"
              >
                {completed ? "プレビューを見る" : "続きを作成"}
                <ArrowRight size={16} />
              </Link>
            </article>
          );
        })}
      </div>
      {resumes.length === 0 && (
        <p className="text-muted-foreground py-12">
          まだ履歴書がありません。「新規作成」から作成できます。
        </p>
      )}
    </div>
  );
}
