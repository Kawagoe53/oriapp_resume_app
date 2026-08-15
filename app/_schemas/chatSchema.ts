import * as z from "zod";

// バリデーションスキーマの定義
export const chatSchema = z.object({
  message: z.string().min(1, { message: "文字を入力してください" }),
});

// 型定義のエクスポート
export type ChatSchemaValues = z.infer<typeof chatSchema>;
