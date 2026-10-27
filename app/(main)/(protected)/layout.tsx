"use client";

import { useRouteGuard } from "@/app/_hooks/useRouteGuard";
import { SWRConfig } from "swr";

const createCache = () => new Map();

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useRouteGuard();

  if (isLoading) return <p role="status">ログイン状態を確認中…</p>;
  if (!session) return null;

  return (
    <SWRConfig key={session.user.id} value={{ provider: createCache }}>
      {children}
    </SWRConfig>
  );
}
