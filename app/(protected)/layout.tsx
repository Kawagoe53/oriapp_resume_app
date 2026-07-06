"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteGuard } from "../_hooks/useRouteGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();

  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <>
      {/* サイドバー */}
      <aside className="fixed bg-gray-100 w-70 left-0 bottom-0 top-18">
        <Link
          href="/resumes"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected("/resumes") && "bg-blue-100"
          }`}
        >
          履歴書一覧
        </Link>
        <Link
          href="/aiUsage"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected("/resumes") && "bg-blue-100"
          }`}
        >
          AI使用回数
        </Link>
      </aside>

      {/* メインエリア */}
      <div className="ml-70 p-4">{children}</div>
    </>
  );
}
