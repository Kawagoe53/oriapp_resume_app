"use client";

import { useState } from "react";
import useResumes from "./useResumes";
import { useSupabaseSession } from "./useSupabaseSession";

export default function useDeleteResume() {
  const { token } = useSupabaseSession();
  const { mutate } = useResumes();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteResume = async (id: string, title: string | null) => {
    setDeleteError(null);
    if (!token) {
      setDeleteError("ログイン状態を確認して、もう一度お試しください。");
      return false;
    }
    if (
      !window.confirm(
        `「${title || "無題の履歴書"}」を削除しますか？\nこの操作は取り消せません。`,
      )
    ) {
      return false;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!response.ok) {
        const message =
          response.status === 401
            ? "ログイン状態を確認して、もう一度お試しください。"
            : response.status === 404
              ? "履歴書が見つかりません。一覧を更新してください。"
              : "履歴書の削除に失敗しました。もう一度お試しください。";
        throw new Error(message);
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "履歴書の削除に失敗しました。",
      );
      setDeletingId(null);
      return false;
    }

    try {
      await mutate();
    } finally {
      setDeletingId(null);
    }
    return true;
  };

  return { deleteResume, deletingId, deleteError };
}
