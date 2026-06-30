import { supabase } from "@/app/_libs/supabase";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useSupabaseSession = () => {
  // 初期値はundefined、 nullにしてしまうと ロード中,未ログインを区別できない
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname(); //今いるURLを取得/resumesとか/loginとか

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //supabaseからsessionを取得
      setSession(session);
      setToken(session?.access_token || null); //セッションからtokenあれば返して、なければnull
    };

    fetcher();
  }, [pathname]); //URL変わるたびにsessionをチェックする

  return { session, isLoading: session === undefined, token };
};
