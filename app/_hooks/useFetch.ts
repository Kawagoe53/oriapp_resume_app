import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";

export default function useFetch<Type>(url: string) {
  const { token } = useSupabaseSession();

  const fetcher = async ([fetchUrl, fetchToken]: [string, string]) => {
    const res = await fetch(fetchUrl, {
      headers: {
        Authorization: fetchToken,
      },
    });

    if (!res.ok) {
      throw new Error("データ取得に失敗しました");
    }
    return res.json();
  };
  return useSWR<Type>(token ? [url, token] : null, fetcher);
}
