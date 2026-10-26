import { supabase } from "@/app/_libs/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

//Supabaseの認証状態を監視して、ログインしているかどうか・読み込み中かどうか・アクセストークンを管理するための処理
export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      //Supabaseが提供する関数で、認証状態の変化を通知してくれる。
      (_event, currentSession) => setSession(currentSession),
    );
    return () => subscription.unsubscribe();
    //関数を返しているため、クリーンアップ関数として、アンマウントされると監視を解除する。
  }, []);

  return {
    session,
    isLoading: session === undefined,
    token: session?.access_token ?? null,
  };
};
