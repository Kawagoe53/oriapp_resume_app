import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();

  useEffect(() => {
    if (isLoading) return; // sessionの取得中は何もしない

    if (session === null) router.replace("/login");
  }, [router, isLoading, session]);

  return { session, isLoading };
};
