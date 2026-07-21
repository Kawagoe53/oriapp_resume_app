import Link from "next/link";

export default function ResumeChatPage() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">履歴書作成</h1>

      <p className="mt-4 text-gray-500">AIチャット画面（準備中）</p>
      <Link
        href="/resumes"
        className={`block p-4 hover:bg-blue-100 "bg-blue-100" : ""
        }`}
      >
        履歴書一覧へ
      </Link>
    </div>
  );
}
