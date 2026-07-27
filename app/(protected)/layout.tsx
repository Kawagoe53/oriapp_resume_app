"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* ハンバーガー */}
      <div
        className="fixed top-4 left-4 z-50"
        onMouseEnter={() => setIsOpen(true)}
      >
        <button className="rounded-md bg-white p-2 shadow">☰</button>
      </div>

      {/* サイドバー */}
      <aside
        onMouseLeave={() => setIsOpen(false)}
        className={`
          fixed left-0 top-0 z-40 h-screen w-64
          bg-gray-100 shadow-lg
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="pt-16">
          <Link
            href="/resumes"
            className={`block p-4 hover:bg-blue-100 ${
              isSelected("/resumes") ? "bg-blue-100" : ""
            }`}
          >
            履歴書一覧
          </Link>

          <Link
            href="/aiUsage"
            className={`block p-4 hover:bg-blue-100 ${
              isSelected("/aiUsage") ? "bg-blue-100" : ""
            }`}
          >
            AI使用回数
          </Link>
        </div>
      </aside>

      <main className="min-h-screen bg-gray-50 pl-20 pr-8 py-8">
        {children}
      </main>
    </>
  );
}
